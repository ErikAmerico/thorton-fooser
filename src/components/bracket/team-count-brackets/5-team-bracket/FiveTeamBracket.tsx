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
import { downstreamOf } from "../../_helpers/matchGraph";
import { blockedBySubmission } from "../../_helpers/canOpenMatch";
import { isSameTeam } from "../../_helpers/isSameTeam";

export default function FiveTeamBracket({
  teams,
  matchResults,
  onChange,
  setIsTourneyFinished,
  fireConfetti,
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
  const team5 = teams[4];

  const showModal = (matchNum: number) => {
    if (blockedBySubmission(hasSubmittedResults, isRevealing)) return;
    let A: Team, B: Team;
    switch (matchNum) {
      case 1:
        A = team4;
        B = team5;
        break;
      case 2:
        A = team2;
        B = team3;
        break;
      case 3:
        if (team1.length < 2) {
          return message.error(
            `${team1[0].name} is waiting for a partner - finish Match 4 first.`
          );
        }
        if (!matchResults[1].winner) {
          return message.error("Need winner from Match 1 first.");
        }
        A = team1;
        B = matchResults[1].winner || "";
        break;
      case 4:
        if (!matchResults[2].loser || !matchResults[1].loser) {
          return message.error("Need losers from Match 1 and 2 first.");
        }
        A = matchResults[2].loser;
        B = matchResults[1].loser;
        break;
      case 5:
        if (!matchResults[3].loser || !matchResults[4].winner) {
          return message.error(
            "Need winner from Match 4 & loser of Match 3 first."
          );
        }
        A = matchResults[3].loser;
        B = matchResults[4].winner;
        break;
      case 6:
        if (!matchResults[3].winner || !matchResults[2].winner) {
          return message.error("Need winner from Match 3 & 2 first.");
        }
        A = matchResults[3].winner;
        B = matchResults[2].winner;
        break;
      case 7:
        if (!matchResults[6].loser || !matchResults[5].winner) {
          return message.error(
            "Need loser from Match 6 & winner from Match 5 first."
          );
        }
        A = matchResults[6].loser;
        B = matchResults[5].winner;
        break;
      case 8:
        if (!matchResults[6].winner || !matchResults[7].winner) {
          return message.error(
            "Need winner from Match 6 & Losers Bracket first."
          );
        }
        A = matchResults[6].winner;
        B = matchResults[7].winner;
        break;
      case 9:
        if (!matchResults[8].winner || !matchResults[8].loser)
          return message.error("Complete Grand Final first.");
        // champion already decided - reopen the deciding match so a
        // misclicked winner can still be corrected with the lock code
        if (isSameTeam(matchResults[8].winner, matchResults[6].winner!)) {
          setModalTeams({
            A: matchResults[8].winner,
            B: matchResults[8].loser,
          });
          setSelectedWinner(null);
          setCurrentMatch(8);
          setIsModalOpen(true);
          return;
        }
        // otherwise reset final
        A = matchResults[8].winner;
        B = matchResults[8].loser;
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
      winnersFinalSlot: 6,
      grandFinalSlot: 8,
      resetFinalSlot: 9,
    });

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMatch(null);
  };

  const semiWinner = matchResults[6]?.winner;
  const grandWinner = matchResults[8]?.winner;
  const resetWinner = matchResults[9]?.winner;
  const tournamentOver = Boolean(
    grandWinner && semiWinner && isSameTeam(grandWinner, semiWinner)
  );
  const needsReset = Boolean(grandWinner && !tournamentOver);

  isTournamentFinsihed({
    resetWinner,
    tournamentOver,
    setIsTourneyFinished,
  });

  return (
    <div className="bracket-shell">
      {/* Top row headers */}
      <div className="header-row">
        <div className="column-header">Round 1</div>
        <div className="column-header">Round 2</div>
        <div className="column-header">Semifinals</div>
        <div className="column-header">Finals</div>
      </div>

      {/* Top row matches */}
      <div className="match-row top-row ">
        <div className="match-cell lower-match-col upper-line">
          <TeamSlot
            value={renderTeamName(team4)}
            title="4 Seed"
          />
          <TeamSlot
            value={renderTeamName(team5)}
            title="5 Seed"
          />
          <span className="match-number">
            Match 1 <TrophyFilled onClick={() => showModal(1)} />
          </span>
        </div>

        {/* round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-line">
            <TeamSlot
              value={renderTeamName(team1)}
              title="1 Seed"
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
              Match 3 <TrophyFilled onClick={() => showModal(3)} />
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

        <div className="match-cell lower-line lower-match-col">
          <TeamSlot
            value={renderTeamName(matchResults[3].winner)}
            placeholder="Winner of 3"
            title={
              renderTeamName(matchResults[3].winner) ? "Winner of 3" : undefined
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
            Match 6 <TrophyFilled onClick={() => showModal(6)} />
          </span>
        </div>

        <div className="match-cell lower-match-col2">
          <TeamSlot
            value={renderTeamName(matchResults[6].winner)}
            placeholder="Winner of 6"
            title={
              renderTeamName(matchResults[6].winner) ? "Winner of 6" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[7].winner)}
            placeholder="Winner of losers"
            title={
              renderTeamName(matchResults[7].winner)
                ? "Winner of Losers"
                : undefined
            }
          />
          <span className="match-number">
            Match 8 <TrophyFilled onClick={() => showModal(8)} />
          </span>
        </div>

        {needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col2 no-dash">
              <TeamSlot
                value={renderTeamName(matchResults[8].winner)}
                placeholder="Winner of 8"
                title={
                  renderTeamName(matchResults[8].winner)
                    ? "Winner of 8"
                    : undefined
                }
              />
              <TeamSlot
                value={renderTeamName(matchResults[8].loser)}
                placeholder="Loser of 8 (if necessary)"
                title={
                  renderTeamName(matchResults[8].loser)
                    ? "loser of 8"
                    : undefined
                }
              />
              <span className="match-number">
                Match 9 <TrophyFilled onClick={() => showModal(9)} />
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
        <div className="column-header">Losers Round 2</div>
        <div className="column-header">Losers Finals</div>
      </div>

      {/* Bottom row matches */}
      <div className="match-row bottom-row">
        {/* Losers Round 1 */}
        <div className="match-cell lower-match-col2 upper-line">
          <TeamSlot
            value={renderTeamName(matchResults[2].loser)}
            placeholder="Loser of 2"
            title={
              renderTeamName(matchResults[2].loser) ? "loser of 2" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[1].loser)}
            placeholder="Loser of 1"
            title={
              renderTeamName(matchResults[1].loser) ? "loser of 1" : undefined
            }
          />
          <span className="match-number">
            Match 4 <TrophyFilled onClick={() => showModal(4)} />
          </span>
        </div>

        {/* Losers Round 2 */}
        <div className="match-cell lower-match-col upper-line single-cell">
          <TeamSlot
            value={renderTeamName(matchResults[3].loser)}
            placeholder="Loser of 3"
            title={
              renderTeamName(matchResults[3].loser) ? "loser of 3" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[4].winner)}
            placeholder="Winner of 4"
            title={
              renderTeamName(matchResults[4].winner) ? "Winner of 4" : undefined
            }
          />
          <span className="match-number">
            Match 5 <TrophyFilled onClick={() => showModal(5)} />
          </span>
        </div>

        <div className="match-cell upper-line angle-up65 single-cell">
          <TeamSlot
            value={renderTeamName(matchResults[6].loser)}
            placeholder="Loser of 6"
            title={
              renderTeamName(matchResults[6].loser) ? "loser of 6" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[5].winner)}
            placeholder="Winner of 5"
            title={
              renderTeamName(matchResults[5].winner) ? "Winner of 5" : undefined
            }
          />
          <span className="match-number">
            Match 7 <TrophyFilled onClick={() => showModal(7)} />
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
        downstream={
          currentMatch !== null
            ? downstreamOf(currentMatch, 5, teams, matchResults)
            : []
        }
      />
      {fireConfetti && !needsReset && grandWinner && <Confetti />}
      {fireConfetti && resetWinner && <Confetti />}
    </div>
  );
}
