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

export default function FourTeamBracket({
  teams,
  matchResults,
  onChange,
  setIsTourneyFinished,
  fireConfetti,
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

  const showModal = (matchNum: number) => {
    let A: Team, B: Team;
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
        // if winners-bracket champ wins GF, tournament ends
        if (matchResults[6].winner === matchResults[4].winner)
          return message.info("Tournament is over — no reset final needed.");
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
    });

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMatch(null);
  };

  const semiWinner = matchResults[4]?.winner;
  const grandWinner = matchResults[6]?.winner;
  const resetWinner = matchResults[7]?.winner;
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
        <div className="column-header">Semifinals</div>
        <div className="column-header">Finals</div>
      </div>

      {/* Round 1 */}
      <div className="match-row top-row">
        <div className="round1-column">
          <div className="match-cell lower-line">
            <input
              className="team-input"
              value={renderTeamName(team1)}
              readOnly
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              title="1 Seed"
            />
            <input
              className="team-input"
              value={renderTeamName(team4)}
              readOnly
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              title="4 Seed"
            />

            <span className="match-number">
              Match 1 <TrophyFilled onClick={() => showModal(1)} />{" "}
            </span>
          </div>
          <div className="match-cell upper-line">
            <input
              className="team-input"
              value={renderTeamName(team2)}
              readOnly
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              title="2 Seed"
            />
            <input
              className="team-input"
              value={renderTeamName(team3)}
              readOnly
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              title="3 Seed"
            />

            <span className="match-number">
              Match 2 <TrophyFilled onClick={() => showModal(2)} />
            </span>
          </div>
        </div>

        {/* Semifinals */}
        <div className="match-cell lower-match-col lower-line">
          <input
            className="team-input"
            placeholder="Winner of 1"
            value={renderTeamName(matchResults[1].winner)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            title={
              renderTeamName(matchResults[1].winner) ? "Winner of 1" : undefined
            }
          />
          <input
            className="team-input"
            placeholder="Winner of 2"
            value={renderTeamName(matchResults[2].winner)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
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
          <input
            className="team-input"
            placeholder="Winner of 4"
            value={renderTeamName(matchResults[4].winner)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            title={
              renderTeamName(matchResults[4].winner) ? "Winner of 4" : undefined
            }
          />
          <input
            className="team-input"
            placeholder="Winner of Losers"
            value={renderTeamName(matchResults[5].winner)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            title={
              renderTeamName(matchResults[5].winner) ? "Winner of 5" : undefined
            }
          />
          <span className="match-number">
            Match 6 <TrophyFilled onClick={() => showModal(6)} />
          </span>
        </div>

        {tournamentOver ? (
          <div className="match-row final-row">
            <div className="match-cell lower-match-col2 champ-cell no-dash">
              <div className="champion-text">
                {renderTeamName(grandWinner)} won!
              </div>
            </div>
          </div>
        ) : needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col2">
              <input
                className="team-input"
                value={renderTeamName(matchResults[6].winner)}
                placeholder="winner of 6"
                readOnly
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                title={
                  renderTeamName(matchResults[6].winner)
                    ? "Winner of 6"
                    : undefined
                }
              />
              <input
                className="team-input"
                value={renderTeamName(matchResults[6].loser)}
                placeholder="loser of 6 (if necessary)"
                readOnly
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
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
            {resetWinner && (
              <div className="match-row final-row">
                <div className="match-cell lower-match-col2 no-dash">
                  <div className="champion-text">
                    {renderTeamName(resetWinner)} won!
                  </div>
                </div>
              </div>
            )}
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
          <input
            className="team-input"
            placeholder="Loser of 1"
            value={renderTeamName(matchResults[1].loser)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            title={
              renderTeamName(matchResults[1].loser) ? "loser of 1" : undefined
            }
          />
          <input
            className="team-input"
            placeholder="Loser of 2"
            value={renderTeamName(matchResults[2].loser)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
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
          <input
            className="team-input"
            placeholder="Loser of 4"
            value={renderTeamName(matchResults[4].loser)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            title={
              renderTeamName(matchResults[4].loser) ? "loser of 4" : undefined
            }
          />
          <input
            className="team-input"
            placeholder="Winner of 3"
            value={renderTeamName(matchResults[3].winner)}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
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
