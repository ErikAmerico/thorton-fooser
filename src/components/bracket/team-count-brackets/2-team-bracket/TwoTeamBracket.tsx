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

export default function TwoTeamBracket({
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

  const showModal = (matchNum: number) => {
    let A: Team, B: Team;
    switch (matchNum) {
      case 1:
        A = team1;
        B = team2;
        break;
      case 2:
        if (!matchResults[1].winner || !matchResults[1].loser) {
          return message.error("Complete Match 1 first.");
        }
        if (matchResults[1].winner === matchResults[2].winner) {
          return message.info("Tournament is over — no reset final needed.");
        }
        A = matchResults[1].winner;
        B = matchResults[1].loser;
        break;
      case 3:
        if (!matchResults[2].loser || !matchResults[2].winner) {
          return message.error("Complete Grand Final first.");
        }
        A = matchResults[2].winner;
        B = matchResults[2].loser;
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

  const semiWinner = matchResults[1]?.winner;
  const grandWinner = matchResults[2]?.winner;
  const resetWinner = matchResults[3]?.winner;
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
        <div className="column-header">Semifinals</div>
        <div className="column-header">Finals</div>
      </div>

      {/* semi finals */}
      <div className="match-row top-row">
        <div className="round1-column">
          <div className="match-cell lower-line">
            <input
              className="team-input"
              value={renderTeamName(team1)}
              readOnly
            />
            <input
              className="team-input"
              value={renderTeamName(team2)}
              readOnly
            />
            <span className="match-number">
              Match 1 <TrophyFilled onClick={() => showModal(1)} />
            </span>
          </div>
        </div>

        {/* Finals / Championship placeholder */}
        <div className="match-cell lower-match-col">
          <input
            className="team-input"
            placeholder=""
            value={renderTeamName(matchResults[1].winner)}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Loser of 1"
            value={renderTeamName(matchResults[1].loser)}
            readOnly
          />
          <span className="match-number">
            Match 2 <TrophyFilled onClick={() => showModal(2)} />
          </span>
        </div>

        {tournamentOver ? (
          <div className="match-row final-row">
            <div className="match-cell lower-match-col champ-cell no-dash">
              <div className="champion-text">
                {renderTeamName(grandWinner)} won!
              </div>
            </div>
          </div>
        ) : needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col">
              <input
                className="team-input"
                value={renderTeamName(matchResults[2].winner)}
                placeholder="winner of 2"
                readOnly
              />
              <input
                className="team-input"
                value={renderTeamName(matchResults[2].loser)}
                placeholder="loser of 2 (if necessary)"
                readOnly
              />
              <span className="match-number">
                Match 3 <TrophyFilled onClick={() => showModal(3)} />
              </span>
            </div>
            {resetWinner && (
              <div className="match-row final-row">
                <div className="match-cell lower-match-col no-dash">
                  <div className="champion-text">
                    {renderTeamName(resetWinner)} won!
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="match-row">
            <div className="match-cell lower-match-col no-dash">
              <h1>?</h1>
            </div>
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
      />
      {!needsReset && grandWinner && <Confetti />}
      {resetWinner && <Confetti />}
    </div>
  );
}
