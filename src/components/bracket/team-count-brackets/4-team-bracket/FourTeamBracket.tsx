import { TrophyFilled } from "@ant-design/icons";
import { message } from "antd";
import { useState } from "react";
import Confetti from "../../confetti";
import { Team, BracketProps } from "../../../../types";
import renderTeamName from "../../_helpers/renderTeamName";
import isTournamentFinsihed from "../../_helpers/isTournamentFinished";
import WhoWonModal from "../../_components/WhoWonModal";
import TeamSlot from "../../_components/TeamSlot";
import confirmWinner from "../../_helpers/confirmWinner";
import { isSameTeam } from "../../_helpers/isSameTeam";
import { blockedBySubmission } from "../../_helpers/canOpenMatch";
import {
  LOSERS_FINAL_SLOTS,
  GRAND_FINAL_SLOTS,
  resolveSeries,
} from "../../_helpers/reserveSeries";

export default function FourTeamBracket({
  teams,
  matchResults,
  onChange,
  setIsTourneyFinished,
  fireConfetti,
  reserveMode,
  hasSubmittedResults,
  isRevealing,
}: BracketProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<number | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<Team | null>(null);
  const [modalTeams, setModalTeams] = useState<{
    A: Team;
    B: Team;
  } | null>(null);

  if (!teams) return <h2 style={{ color: "white" }}>Waiting on teams...</h2>;

  const team1 = teams[0];
  const team2 = teams[1];
  const team3 = teams[2];
  const team4 = teams[3];

  // ---------------------------------------------------------------------
  // 7-player (reserve) bracket
  //
  //   M1  Team 2 v Team 3            only winners round-1 match
  //   M2  Team 1 (bye) v Winner 1    semifinal
  //   M3  Loser 1 v Loser 2          losers R1 - loser is out and DONATES
  //   M4  Winner 3 v Reserve         losers final
  //   M5  (same teams)               losers decider, ONLY if M4 did not settle it
  //       Winner 2 v losers winner   grand final      - M5 or M6
  //       (same teams)               grand final decider, if needed - M6 or M7
  //
  // The losers decider is conditional, so the two finals renumber themselves
  // depending on whether it exists (see grandFinalNumber).
  //
  // The losers final and grand final are each played until one side has 2
  // losses across the whole tournament, so a team that already lost only has
  // to be beaten once more. Each game is stored in its own result slot.
  // ---------------------------------------------------------------------
  const reserveTeam = team4;

  const losersFinalEntrants =
    reserveMode && matchResults[3]?.winner && reserveTeam.length === 2
      ? { A: matchResults[3].winner, B: reserveTeam }
      : null;
  const losersFinal = resolveSeries(
    losersFinalEntrants,
    LOSERS_FINAL_SLOTS,
    matchResults
  );

  const grandFinalEntrants =
    reserveMode && matchResults[2]?.winner && losersFinal.winner
      ? { A: matchResults[2].winner, B: losersFinal.winner }
      : null;
  const grandFinal = resolveSeries(
    grandFinalEntrants,
    GRAND_FINAL_SLOTS,
    matchResults
  );

  // gameIndex targets a specific game of a series (0-based), so an earlier
  // game can be reopened and corrected rather than only the latest one
  const showModal = (matchNum: number, gameIndex?: number) => {
    if (blockedBySubmission(hasSubmittedResults, isRevealing)) return;
    let A: Team, B: Team;

    if (reserveMode) {
      switch (matchNum) {
        case 1:
          A = team2;
          B = team3;
          break;
        case 2:
          if (!matchResults[1].winner) {
            return message.error("Need winner from Match 1 first.");
          }
          A = team1;
          B = matchResults[1].winner;
          break;
        case 3:
          if (!matchResults[1].loser || !matchResults[2].loser) {
            return message.error("Need losers from Match 1 and 2 first.");
          }
          A = matchResults[1].loser;
          B = matchResults[2].loser;
          break;
        case 4:
          if (!matchResults[3].winner) {
            return message.error("Need winner from Match 3 first.");
          }
          if (reserveTeam.length < 2) {
            return message.error(
              `${reserveTeam[0].name} is waiting for a partner - finish Match 3 first.`
            );
          }
          A = matchResults[3].winner;
          B = reserveTeam;
          break;
        case 5:
          if (!matchResults[2].winner) {
            return message.error("Need winner from Match 2 first.");
          }
          if (!losersFinal.winner) {
            return message.error("Finish the losers final first.");
          }
          A = matchResults[2].winner;
          B = losersFinal.winner;
          break;
        default:
          return;
      }

      // Series matches write to the next free slot instead of a fixed index.
      // Each played game renders its own box and passes its game number, so
      // every game stays correctable - not just the most recent one. Without a
      // game number (the "play the next one" trophy) fall back to the next free
      // slot, or the last played game once the series is decided.
      const series =
        matchNum === 4 ? losersFinal : matchNum === 5 ? grandFinal : null;
      const seriesSlots = matchNum === 4 ? LOSERS_FINAL_SLOTS : GRAND_FINAL_SLOTS;
      const slot = series
        ? gameIndex != null
          ? seriesSlots[gameIndex] ?? null
          : series.nextSlot ?? series.lastPlayedSlot
        : matchNum;
      if (slot == null) return;

      setModalTeams({ A, B });
      setSelectedWinner(null);
      setCurrentMatch(slot);
      setIsModalOpen(true);
      return;
    }

    switch (matchNum) {
      case 1:
        A = team1;
        B = team4;
        break;
      case 2:
        A = team2;
        B = team3;
        break;
      case 3:
        if (!matchResults[1].loser || !matchResults[2].loser) {
          return message.error("Need losers from Match 1 and 2 first.");
        }
        A = matchResults[1].loser;
        B = matchResults[2].loser;
        break;
      case 4:
        if (!matchResults[2].winner || !matchResults[1].winner) {
          return message.error("Need winners from Match 1 and 2 first.");
        }
        A = matchResults[1].winner;
        B = matchResults[2].winner;
        break;
      case 5:
        if (!matchResults[4].loser || !matchResults[3].winner) {
          return message.error(
            "Need winner from Match 3 & loser of Match 4 first."
          );
        }
        A = matchResults[4].loser;
        B = matchResults[3].winner;
        break;
      case 6:
        if (!matchResults[4].winner || !matchResults[5].winner) {
          return message.error(
            "Need winner from Match 4 & Losers Bracket first."
          );
        }
        A = matchResults[4].winner;
        B = matchResults[5].winner;
        break;
      case 7:
        if (!matchResults[6].winner || !matchResults[6].loser)
          return message.error("Complete Grand Final first.");
        // champion already decided - reopen the deciding match so a
        // misclicked winner can still be corrected with the lock code
        if (isSameTeam(matchResults[6].winner, matchResults[4].winner!)) {
          setModalTeams({
            A: matchResults[6].winner,
            B: matchResults[6].loser,
          });
          setSelectedWinner(null);
          setCurrentMatch(6);
          setIsModalOpen(true);
          return;
        }
        // otherwise reset final
        A = matchResults[6].winner;
        B = matchResults[6].loser;
        break;
      default:
        return;
    }
    setModalTeams({ A, B });
    setSelectedWinner(null);
    setCurrentMatch(matchNum);
    setIsModalOpen(true);
  };

  const handleOk = () =>
    confirmWinner({
      currentMatch,
      selectedWinner,
      modalTeams,
      matchResults,
      onChange,
      closeModal,
      // Reserve mode has no reset final - slots 4-6 are the losers-final
      // series and 7-10 the grand-final series. Passing the standard bracket's
      // slot numbers here would make confirmWinner erase grand-final game 1
      // the moment it is recorded.
      ...(reserveMode
        ? {}
        : { winnersFinalSlot: 4, grandFinalSlot: 6, resetFinalSlot: 7 }),
    });

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMatch(null);
  };

  const semiWinner = matchResults[4]?.winner;
  const grandWinner = matchResults[6]?.winner;
  const resetWinner = matchResults[7]?.winner;
  const tournamentOver = reserveMode
    ? Boolean(grandFinal.winner)
    : Boolean(grandWinner && semiWinner && isSameTeam(grandWinner, semiWinner));
  const needsReset = reserveMode
    ? false
    : Boolean(grandWinner && !tournamentOver);

  isTournamentFinsihed({
    resetWinner: reserveMode ? grandFinal.winner : resetWinner,
    tournamentOver,
    setIsTourneyFinished,
  });

  if (reserveMode) {
    const champion = grandFinal.winner;
    // The losers final needed a second game if game 1 did not end the series.
    // That box stays visible for the rest of the tournament - those games count
    // toward every player's score, so they belong on the bracket permanently.
    const losersFinalDecider = losersFinal.games.length > 1 ||
      Boolean(losersFinal.games.length > 0 && !losersFinal.winner);
    // The grand final can need up to three games: if both teams arrive
    // undefeated, one has to lose twice. So render a box per extra game the
    // series has actually reached - a fixed pair would leave game 3 nowhere to
    // go. Played boxes stay put; the champion is announced in the banner.
    const grandFinalExtras = Math.max(
      0,
      (champion ? grandFinal.games.length : grandFinal.games.length + 1) - 1
    );
    // The losers decider only exists sometimes, so everything after it shifts
    // by one: finals start at Match 5 or 6.
    const grandFinalNumber = losersFinalDecider ? 6 : 5;

    return (
      <div className="bracket-shell">
        {/* Top row headers */}
        <div className="header-row">
          <div className="column-header">Round 1</div>
          <div className="column-header">Semifinals</div>
          <div className="column-header">Finals</div>
        </div>

        {/* Top row matches */}
        <div className="match-row top-row">
          <div className="round1-column">
            <div className="match-cell lower-match-col upper-line">
              <TeamSlot
                value={renderTeamName(team2)}
                title="2 Seed"
              />
              <TeamSlot
                value={renderTeamName(team3)}
                title="3 Seed"
              />
              <span className="match-number">
                Match 1 <TrophyFilled onClick={() => showModal(1)} />
              </span>
            </div>
          </div>

          {/* Semifinals - team 1 has the bye */}
          <div className="match-cell lower-line lower-match-col">
            <TeamSlot
              value={renderTeamName(team1)}
              title="1 Seed (bye)"
            />
            <TeamSlot
              value={renderTeamName(matchResults[1].winner)}
              placeholder="Winner of 1"
              title={
                renderTeamName(matchResults[1].winner)
                  ? "Winner of 1"
                  : undefined
              }
            />
            <span className="match-number">
              Match 2 <TrophyFilled onClick={() => showModal(2)} />
            </span>
          </div>

          {/* Grand final - only draws its arrow when a later box follows it */}
          <div
            className={`match-cell lower-match-col2${
              grandFinalExtras > 0 || !champion ? "" : " no-dash"
            }`}
          >
            <TeamSlot
              value={renderTeamName(matchResults[2].winner)}
              placeholder="Winner of 2"
              title={
                renderTeamName(matchResults[2].winner)
                  ? "Winner of 2"
                  : undefined
              }
            />
            <TeamSlot
              value={renderTeamName(losersFinal.winner)}
              placeholder="Winner of 4"
              title={
                renderTeamName(losersFinal.winner) ? "Winner of 4" : undefined
              }
            />
            <span className="match-number">
              Match{" "}
              <span key={grandFinalNumber} className="match-number-value">
                {grandFinalNumber}
              </span>{" "}
              {/* game 1 of the series - without the index this falls through
                  to the next free slot and silently records an extra game */}
              <TrophyFilled onClick={() => showModal(5, 0)} />
            </span>
          </div>

          {/* one box per extra grand-final game the series has reached */}
          {grandFinalExtras > 0 && grandFinalEntrants
            ? Array.from({ length: grandFinalExtras }, (_, i) => (
                <div className="match-row" key={`gf-extra-${i}`}>
                  {/* arrow only if another game box follows this one */}
                  <div
                    className={`match-cell lower-match-col2${
                      i === grandFinalExtras - 1 ? " no-dash" : ""
                    }`}
                  >
                    <TeamSlot
                      value={renderTeamName(grandFinalEntrants.A)}
                      title="Grand final decider"
                    />
                    <TeamSlot
                      value={renderTeamName(grandFinalEntrants.B)}
                      title="Grand final decider"
                    />
                    <span className="match-number">
                      Match{" "}
                      <span
                        key={grandFinalNumber + 1 + i}
                        className="match-number-value"
                      >
                        {grandFinalNumber + 1 + i}
                      </span>{" "}
                      <TrophyFilled onClick={() => showModal(5, i + 1)} />
                    </span>
                  </div>
                </div>
              ))
            : !champion && (
                <div className="match-row">
                  <div className="match-cell lower-match-col2 no-dash">
                    <h1>?</h1>
                  </div>
                </div>
              )}
        </div>

        {/* Bottom row headers */}
        <div className="header-row losers-headers">
          <div className="column-header">Losers Round 1</div>
          <div className="column-header">Losers Finals</div>
          {losersFinalDecider && (
            <div className="column-header decider-cell">Losers Decider</div>
          )}
        </div>

        {/* Bottom row matches */}
        <div className="match-row bottom-row">
          {/* Losers round 1 - loser is eliminated and donates a player */}
          <div className="match-cell lower-match-col upper-line">
            <TeamSlot
              value={renderTeamName(matchResults[1].loser)}
              placeholder="Loser of 1"
              title={
                renderTeamName(matchResults[1].loser) ? "loser of 1" : undefined
              }
            />
            <TeamSlot
              value={renderTeamName(matchResults[2].loser)}
              placeholder="Loser of 2"
              title={
                renderTeamName(matchResults[2].loser) ? "loser of 2" : undefined
              }
            />
            <span className="match-number">
              Match 3 <TrophyFilled onClick={() => showModal(3)} />
            </span>
          </div>

          {/* Losers final - reserve enters here. If game 1 does not decide it,
              a decider box fades in and takes over the arrow to the finals. */}
          <div
            className={`match-cell upper-line angle-up65 single-cell${
              losersFinalDecider ? " arrow-retired" : ""
            }`}
          >
            <TeamSlot
              value={renderTeamName(matchResults[3].winner)}
              placeholder="Winner of 3"
              title={
                renderTeamName(matchResults[3].winner)
                  ? "Winner of 3"
                  : undefined
              }
            />
            <TeamSlot
              value={renderTeamName(reserveTeam)}
              title="Reserve Team"
            />
            <span className="match-number">
              {/* game 1 of the series - see the grand final above */}
              Match 4 <TrophyFilled onClick={() => showModal(4, 0)} />
            </span>
          </div>

          {/* Losers final decider - stays on the bracket once it exists, since
              its result counts toward every player's score */}
          {losersFinalDecider && losersFinalEntrants && (
            <div className="match-cell upper-line angle-up90 single-cell decider-cell">
              <TeamSlot
                value={renderTeamName(losersFinalEntrants.A)}
                title="Losers final decider"
              />
              <TeamSlot
                value={renderTeamName(losersFinalEntrants.B)}
                title="Losers final decider"
              />
              <span className="match-number">
                Match 5 <TrophyFilled onClick={() => showModal(4, 1)} />
              </span>
            </div>
          )}
        </div>

        <WhoWonModal
          open={isModalOpen}
          teams={modalTeams}
          selectedWinner={selectedWinner}
          onSelect={setSelectedWinner}
          onOk={handleOk}
          onCancel={closeModal}
          okDisabled={
            currentMatch !== null && Boolean(matchResults[currentMatch]?.winner)
          }
        />
        {fireConfetti && champion && <Confetti />}
      </div>
    );
  }

  return (
    <div className="bracket-shell">
      {/* Top row headers */}
      <div className="header-row">
        <div className="column-header">Round 1</div>
        <div className="column-header">Semifinals</div>
        <div className="column-header">Finals</div>
      </div>

      {/* Round 1 */}
      <div className="match-row top-row">
        <div className="round1-column">
          <div className="match-cell lower-line">
            <TeamSlot
              value={renderTeamName(team1)}
              title="1 Seed"
            />
            <TeamSlot
              value={renderTeamName(team4)}
              title="4 Seed"
            />

            <span className="match-number">
              Match 1 <TrophyFilled onClick={() => showModal(1)} />{" "}
            </span>
          </div>
          <div className="match-cell upper-line">
            <TeamSlot
              value={renderTeamName(team2)}
              title="2 Seed"
            />
            <TeamSlot
              value={renderTeamName(team3)}
              title="3 Seed"
            />

            <span className="match-number">
              Match 2 <TrophyFilled onClick={() => showModal(2)} />
            </span>
          </div>
        </div>

        {/* Semifinals */}
        <div className="match-cell lower-match-col lower-line">
          <TeamSlot
            value={renderTeamName(matchResults[1].winner)}
            placeholder="Winner of 1"
            title={
              renderTeamName(matchResults[1].winner) ? "Winner of 1" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[2].winner)}
            placeholder="Winner of 2"
            title={
              renderTeamName(matchResults[2].winner) ? "Winner of 2" : undefined
            }
          />
          <span className="match-number">
            Match 4 <TrophyFilled onClick={() => showModal(4)} />
          </span>
        </div>

        {/* Finals / Championship placeholder */}
        <div className="match-cell lower-match-col2">
          <TeamSlot
            value={renderTeamName(matchResults[4].winner)}
            placeholder="Winner of 4"
            title={
              renderTeamName(matchResults[4].winner) ? "Winner of 4" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[5].winner)}
            placeholder="Winner of Losers"
            title={
              renderTeamName(matchResults[5].winner) ? "Winner of 5" : undefined
            }
          />
          <span className="match-number">
            Match 6 <TrophyFilled onClick={() => showModal(6)} />
          </span>
        </div>

        {needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col2 no-dash">
              <TeamSlot
                value={renderTeamName(matchResults[6].winner)}
                placeholder="winner of 6"
                title={
                  renderTeamName(matchResults[6].winner)
                    ? "Winner of 6"
                    : undefined
                }
              />
              <TeamSlot
                value={renderTeamName(matchResults[6].loser)}
                placeholder="loser of 6 (if necessary)"
                title={
                  renderTeamName(matchResults[6].loser)
                    ? "loser of 6"
                    : undefined
                }
              />
              <span className="match-number">
                Match 7 <TrophyFilled onClick={() => showModal(7)} />
              </span>
            </div>
          </div>
        ) : (
          <div className="match-row">
            <div className="match-cell lower-match-col2 no-dash">
              <h1>?</h1>
            </div>
          </div>
        )}
      </div>

      {/* Bottom row headers */}
      <div className="header-row losers-headers">
        <div className="column-header">Losers Round 1</div>
        <div className="column-header">Losers Finals</div>
      </div>

      {/* Bottom row matches */}
      <div className="match-row bottom-row">
        {/* Losers Round 1 */}
        <div className="match-cell lower-match-col upper-line">
          <TeamSlot
            value={renderTeamName(matchResults[1].loser)}
            placeholder="Loser of 1"
            title={
              renderTeamName(matchResults[1].loser) ? "loser of 1" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[2].loser)}
            placeholder="Loser of 2"
            title={
              renderTeamName(matchResults[2].loser) ? "loser of 2" : undefined
            }
          />
          <span className="match-number">
            Match 3 <TrophyFilled onClick={() => showModal(3)} />
          </span>
        </div>

        {/* Losers Round 2 */}
        <div className="match-cell upper-line angle-up65 single-cell">
          <TeamSlot
            value={renderTeamName(matchResults[4].loser)}
            placeholder="Loser of 4"
            title={
              renderTeamName(matchResults[4].loser) ? "loser of 4" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[3].winner)}
            placeholder="Winner of 3"
            title={
              renderTeamName(matchResults[3].winner) ? "Winner of 3" : undefined
            }
          />
          <span className="match-number">
            Match 5 <TrophyFilled onClick={() => showModal(5)} />
          </span>
        </div>
      </div>
      <WhoWonModal
        open={isModalOpen}
        teams={modalTeams}
        selectedWinner={selectedWinner}
        onSelect={setSelectedWinner}
        onOk={handleOk}
        onCancel={closeModal}
        okDisabled={
          currentMatch !== null && Boolean(matchResults[currentMatch]?.winner)
        }
      />

      {fireConfetti && !needsReset && grandWinner && <Confetti />}
      {fireConfetti && resetWinner && <Confetti />}
    </div>
  );
}
