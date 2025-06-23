import { TrophyFilled } from "@ant-design/icons";
import { message } from "antd";
import { useState } from "react";
import Confetti from "../../confetti";
import { Team, BracketProps } from "../../../../types";
import renderTeamName from "../../_helpers/renderTeamName";
import isTournamentFinsihed from "../../_helpers/isTournamentFinished";
import WhoWonModal from "../../_components/WhoWonModal";
import confirmWinner from "../../_helpers/confirmWinner";
import { isSameTeam } from "../../_helpers/isSameTeam";

export default function EightTeamBracket({
  teams,
  matchResults,
  onChange,
  setIsTourneyFinished,
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
  const team6 = teams[5];
  const team7 = teams[6];
  const team8 = teams[7];

  const showModal = (matchNum: number) => {
    let A: Team, B: Team;
    switch (matchNum) {
      case 1:
        A = team1;
        B = team8;
        break;
      case 2:
        A = team4;
        B = team5;
        break;
      case 3:
        A = team2;
        B = team7;
        break;
      case 4:
        A = team3;
        B = team6;
        break;
      case 5:
        if (!matchResults[1].loser || !matchResults[2].loser) {
          return message.error("Need loser from Match 1 & 2 first.");
        }
        A = matchResults[1].loser;
        B = matchResults[2].loser;
        break;
      case 6:
        if (!matchResults[3].loser || !matchResults[4].loser) {
          return message.error("Need loser from Match 3 & 4 first.");
        }
        A = matchResults[3].loser;
        B = matchResults[4].loser;
        break;
      case 7:
        if (!matchResults[1].winner || !matchResults[2].winner) {
          return message.error("Need winner from Match 1 & 2 first.");
        }
        A = matchResults[1].winner;
        B = matchResults[2].winner;
        break;
      case 8:
        if (!matchResults[3].winner || !matchResults[4].winner) {
          return message.error("Need winner from Match 3 & 4 first.");
        }
        A = matchResults[3].winner;
        B = matchResults[4].winner;
        break;
      case 9:
        if (!matchResults[6].winner || !matchResults[7].loser) {
          return message.error("Need winner of 6 & loser of 7 first.");
        }
        A = matchResults[7].loser;
        B = matchResults[6].winner;
        break;
      case 10:
        if (!matchResults[5].winner || !matchResults[8].loser) {
          return message.error("Need winner of 5 & loser of 8 first.");
        }
        A = matchResults[8].loser;
        B = matchResults[5].winner;
        break;
      case 11:
        if (!matchResults[10].winner || !matchResults[9].winner) {
          return message.error("Need winner from Match 10 & 9 first.");
        }
        A = matchResults[10].winner;
        B = matchResults[9].winner;
        break;
      case 12:
        if (!matchResults[7].winner || !matchResults[8].winner) {
          return message.error("Need winner from Match 7 & 8 first.");
        }
        A = matchResults[7].winner;
        B = matchResults[8].winner;
        break;
      case 13:
        if (!matchResults[12].loser || !matchResults[11].winner) {
          return message.error(
            "Need winner from Match 11 & loser of 12 first."
          );
        }
        A = matchResults[12].loser;
        B = matchResults[11].winner;
        break;
      case 14:
        if (!matchResults[12].winner || !matchResults[13].winner) {
          return message.error("Need winner from Match 12 & losers first.");
        }
        A = matchResults[12].winner;
        B = matchResults[13].winner;
        break;
      case 15:
        if (!matchResults[14].winner || !matchResults[14].loser)
          return message.error("Complete Grand Final first.");
        // if winners-bracket champ wins GF, tournament ends
        if (matchResults[14].winner === matchResults[12].winner)
          return message.info("Tournament is over — no reset final needed.");
        // otherwise reset final
        A = matchResults[14].winner;
        B = matchResults[14].loser;
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
    });

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMatch(null);
  };

  const semiWinner = matchResults[12]?.winner;
  const grandWinner = matchResults[14]?.winner;
  const resetWinner = matchResults[15]?.winner;
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
        <div className="round1-column">
          <div className="match-cell lower-match-col lower-line">
            <input
              className="team-input"
              value={renderTeamName(team1)}
              readOnly
              title="1 Seed"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              value={renderTeamName(team8)}
              readOnly
              title="8 Seed"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 1 <TrophyFilled onClick={() => showModal(1)} />
            </span>
          </div>

          <div className="match-cell upper-line">
            <input
              className="team-input"
              value={renderTeamName(team4)}
              readOnly
              title="4 Seed"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              value={renderTeamName(team5)}
              readOnly
              title="5 Seed"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 2 <TrophyFilled onClick={() => showModal(2)} />
            </span>
          </div>

          <div className="match-cell lower-line">
            <input
              className="team-input"
              value={renderTeamName(team2)}
              readOnly
              title="2 Seed"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              value={renderTeamName(team7)}
              readOnly
              title="7 Seed"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 3 <TrophyFilled onClick={() => showModal(3)} />
            </span>
          </div>

          <div className="match-cell upper-line">
            <input
              className="team-input"
              value={renderTeamName(team3)}
              readOnly
              title="3 Seed"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              value={renderTeamName(team6)}
              readOnly
              title="6 Seed"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 4 <TrophyFilled onClick={() => showModal(4)} />
            </span>
          </div>
        </div>

        {/* round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-match-col2 lower-line angle-down45">
            <input
              placeholder="Winner of 1"
              className="team-input"
              value={renderTeamName(matchResults[1].winner)}
              readOnly
              title={
                renderTeamName(matchResults[1].winner)
                  ? "Winner of 1"
                  : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              placeholder="Winner of 2"
              value={renderTeamName(matchResults[2].winner)}
              readOnly
              title={
                renderTeamName(matchResults[2].winner)
                  ? "Winner of 2"
                  : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 7 <TrophyFilled onClick={() => showModal(7)} />
            </span>
          </div>

          <div className="match-cell lower-match-col2 upper-line angle-up45">
            <input
              className="team-input"
              placeholder="Winner of 3"
              value={renderTeamName(matchResults[3].winner)}
              readOnly
              title={
                renderTeamName(matchResults[3].winner)
                  ? "Winner of 3"
                  : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              placeholder="Winner of 4"
              value={renderTeamName(matchResults[4].winner)}
              readOnly
              title={
                renderTeamName(matchResults[4].winner)
                  ? "Winner of 4"
                  : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 8 <TrophyFilled onClick={() => showModal(8)} />
            </span>
          </div>
        </div>

        <div className="match-cell lower-line lower-match-col4">
          <input
            className="team-input"
            placeholder="Winner of 7"
            value={renderTeamName(matchResults[7].winner)}
            readOnly
            title={
              renderTeamName(matchResults[7].winner) ? "Winner of 7" : undefined
            }
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          />
          <input
            className="team-input"
            placeholder="Winner of 8"
            value={renderTeamName(matchResults[8].winner)}
            readOnly
            title={
              renderTeamName(matchResults[8].winner) ? "Winner of 8" : undefined
            }
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          />
          <span className="match-number">
            Match 12 <TrophyFilled onClick={() => showModal(12)} />
          </span>
        </div>

        <div className="match-cell lower-match-col5">
          <input
            className="team-input"
            placeholder="Winner of 12"
            value={renderTeamName(matchResults[12].winner)}
            readOnly
            title={
              renderTeamName(matchResults[12].winner)
                ? "Winner of 12"
                : undefined
            }
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          />
          <input
            className="team-input"
            placeholder="Winner of losers"
            value={renderTeamName(matchResults[13].winner)}
            readOnly
            title={
              renderTeamName(matchResults[13].winner)
                ? "Winner of losers"
                : undefined
            }
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          />
          <span className="match-number">
            Match 14 <TrophyFilled onClick={() => showModal(14)} />
          </span>
        </div>

        {tournamentOver ? (
          <div className="match-row final-row">
            <div className="match-cell lower-match-col5 champ-cell no-dash">
              <div className="champion-text">
                {renderTeamName(grandWinner)} won!
              </div>
            </div>
          </div>
        ) : needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col5">
              <input
                className="team-input"
                value={renderTeamName(matchResults[14].winner)}
                placeholder="Winner of 14"
                readOnly
                title={
                  renderTeamName(matchResults[14].winner)
                    ? "Winner of 14"
                    : undefined
                }
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
              />
              <input
                className="team-input"
                value={renderTeamName(matchResults[14].loser)}
                placeholder="Loser of 14 (if necessary)"
                readOnly
                title={
                  renderTeamName(matchResults[14].loser)
                    ? "loser of 14"
                    : undefined
                }
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
              />
              <span className="match-number">
                Match 15 <TrophyFilled onClick={() => showModal(15)} />
              </span>
            </div>
            {resetWinner && (
              <div className="match-row final-row">
                <div className="match-cell lower-match-col5 no-dash">
                  <div className="champion-text">
                    {renderTeamName(resetWinner)} won!
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="match-row">
            <div className="match-cell lower-match-col5 no-dash">
              <h1>?</h1>
            </div>
          </div>
        )}
      </div>

      {/* Bottom row headers */}
      <div className="header-row losers-headers">
        <div className="column-header">Losers Round 1</div>
        <div className="column-header">Losers Round 2</div>
        <div className="column-header">Losers Round 3</div>
        <div className="column-header">Losers Finals</div>
      </div>

      {/* Bottom row matches */}
      <div className="match-row bottom-row">
        <div className="round1-column">
          {/* Losers Round 1 */}
          <div className="match-cell lower-match-col upper-line">
            <input
              className="team-input"
              placeholder="Loser of 1"
              value={renderTeamName(matchResults[1].loser)}
              readOnly
              title={
                renderTeamName(matchResults[1].loser) ? "loser of 1" : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              placeholder="Loser of 2"
              value={renderTeamName(matchResults[2].loser)}
              readOnly
              title={
                renderTeamName(matchResults[2].loser) ? "loser of 2" : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 5 <TrophyFilled onClick={() => showModal(5)} />
            </span>
          </div>

          <div className="match-cell upper-line">
            <input
              className="team-input"
              placeholder="Loser of 3"
              value={renderTeamName(matchResults[3].loser)}
              readOnly
              title={
                renderTeamName(matchResults[3].loser) ? "loser of 3" : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              placeholder="Loser of 4"
              value={renderTeamName(matchResults[4].loser)}
              readOnly
              title={
                renderTeamName(matchResults[4].loser) ? "loser of 4" : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 6 <TrophyFilled onClick={() => showModal(6)} />
            </span>
          </div>
        </div>

        {/* Losers Round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-line single-cell">
            <input
              className="team-input"
              placeholder="Loser of 8"
              value={renderTeamName(matchResults[8].loser)}
              readOnly
              title={
                renderTeamName(matchResults[8].loser) ? "loser of 8" : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              placeholder="Winner of 5"
              value={renderTeamName(matchResults[5].winner)}
              readOnly
              title={
                renderTeamName(matchResults[5].winner)
                  ? "winner of 5"
                  : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 10 <TrophyFilled onClick={() => showModal(10)} />
            </span>
          </div>

          <div className="match-cell upper-line single-cell">
            <input
              className="team-input"
              placeholder="Loser of 7"
              value={renderTeamName(matchResults[7].loser)}
              readOnly
              title={
                renderTeamName(matchResults[7].loser) ? "loser of 7" : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <input
              className="team-input"
              placeholder="Winner of 6"
              value={renderTeamName(matchResults[6].winner)}
              readOnly
              title={
                renderTeamName(matchResults[6].winner)
                  ? "Winner of 6"
                  : undefined
              }
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
            />
            <span className="match-number">
              Match 9 <TrophyFilled onClick={() => showModal(9)} />
            </span>
          </div>
        </div>

        {/* Losers Round 3 */}
        <div className="match-cell lower-match-col upper-line single-cell">
          <input
            className="team-input"
            placeholder="Winner of 10"
            value={renderTeamName(matchResults[10].winner)}
            readOnly
            title={
              renderTeamName(matchResults[10].winner)
                ? "Winner of 10"
                : undefined
            }
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          />
          <input
            className="team-input"
            placeholder="Winner of 9"
            value={renderTeamName(matchResults[9].winner)}
            readOnly
            title={
              renderTeamName(matchResults[9].winner) ? "Winner of 9" : undefined
            }
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          />
          <span className="match-number">
            Match 11 <TrophyFilled onClick={() => showModal(11)} />
          </span>
        </div>

        <div className="match-cell upper-line angle-up90 single-cell">
          <input
            className="team-input"
            placeholder="Loser of 12"
            value={renderTeamName(matchResults[12].loser)}
            readOnly
            title={
              renderTeamName(matchResults[12].loser) ? "Loser of 12" : undefined
            }
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          />
          <input
            className="team-input"
            placeholder="Winner of 11"
            value={renderTeamName(matchResults[11].winner)}
            readOnly
            title={
              renderTeamName(matchResults[11].winner)
                ? "Winner of 11"
                : undefined
            }
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          />
          <span className="match-number">
            Match 13 <TrophyFilled onClick={() => showModal(13)} />
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
      />
      {!needsReset && grandWinner && <Confetti />}
      {resetWinner && <Confetti />}
    </div>
  );
}
