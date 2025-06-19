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

export default function FiveTeamBracket({
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

  const showModal = (matchNum: number) => {
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
        // if winners-bracket champ wins GF, tournament ends
        if (matchResults[8].winner === matchResults[6].winner)
          return message.info("Tournament is over — no reset final needed.");
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
          <input
            className="team-input"
            value={renderTeamName(team4)}
            readOnly
          />
          <input
            className="team-input"
            value={renderTeamName(team5)}
            readOnly
          />
          <span className="match-number">
            Match 1 <TrophyFilled onClick={() => showModal(1)} />
          </span>
        </div>

        {/* round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-line">
            <input
              className="team-input"
              value={renderTeamName(team1)}
              readOnly
            />
            <input
              className="team-input"
              placeholder="Winner of 1"
              value={renderTeamName(matchResults[1].winner)}
              readOnly
            />
            <span className="match-number">
              Match 3 <TrophyFilled onClick={() => showModal(3)} />
            </span>
          </div>

          <div className="match-cell upper-line">
            <input
              className="team-input"
              value={renderTeamName(team2)}
              readOnly
            />
            <input
              className="team-input"
              value={renderTeamName(team3)}
              readOnly
            />
            <span className="match-number">
              Match 2 <TrophyFilled onClick={() => showModal(2)} />
            </span>
          </div>
        </div>

        <div className="match-cell lower-line lower-match-col">
          <input
            className="team-input"
            placeholder="Winner of 3"
            value={renderTeamName(matchResults[3].winner)}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of 2"
            value={renderTeamName(matchResults[2].winner)}
            readOnly
          />
          <span className="match-number">
            Match 6 <TrophyFilled onClick={() => showModal(6)} />
          </span>
        </div>

        <div className="match-cell lower-match-col2">
          <input
            className="team-input"
            placeholder="Winner of 6"
            value={renderTeamName(matchResults[6].winner)}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of losers"
            value={renderTeamName(matchResults[7].winner)}
            readOnly
          />
          <span className="match-number">
            Match 8 <TrophyFilled onClick={() => showModal(8)} />
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
                value={renderTeamName(matchResults[8].winner)}
                placeholder="Winner of 8"
                readOnly
              />
              <input
                className="team-input"
                value={renderTeamName(matchResults[8].loser)}
                placeholder="Loser of 8 (if necessary)"
                readOnly
              />
              <span className="match-number">
                Match 9 <TrophyFilled onClick={() => showModal(9)} />
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
        <div className="column-header">Losers Round 2</div>
        <div className="column-header">Losers Finals</div>
      </div>

      {/* Bottom row matches */}
      <div className="match-row bottom-row">
        {/* Losers Round 1 */}
        <div className="match-cell lower-match-col2 upper-line">
          <input
            className="team-input"
            placeholder="Loser of 2"
            value={renderTeamName(matchResults[2].loser)}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Loser of 1"
            value={renderTeamName(matchResults[1].loser)}
            readOnly
          />
          <span className="match-number">
            Match 4 <TrophyFilled onClick={() => showModal(4)} />
          </span>
        </div>

        {/* Losers Round 2 */}
        <div className="match-cell lower-match-col upper-line single-cell">
          <input
            className="team-input"
            placeholder="Loser of 3"
            value={renderTeamName(matchResults[3].loser)}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of 4"
            value={renderTeamName(matchResults[4].winner)}
            readOnly
          />
          <span className="match-number">
            Match 5 <TrophyFilled onClick={() => showModal(5)} />
          </span>
        </div>

        <div className="match-cell upper-line angle-up65 single-cell">
          <input
            className="team-input"
            placeholder="Loser of 6"
            value={renderTeamName(matchResults[6].loser)}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of 5"
            value={renderTeamName(matchResults[5].winner)}
            readOnly
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
      />
      {!needsReset && grandWinner && <Confetti />}
      {resetWinner && <Confetti />}
    </div>
  );
}
