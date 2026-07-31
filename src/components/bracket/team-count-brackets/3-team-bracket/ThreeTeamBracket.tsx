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
import { blockedBySubmission } from "../../_helpers/canOpenMatch";
import { isSameTeam } from "../../_helpers/isSameTeam";

export default function ThreeTeamBracket({
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

  const showModal = (matchNum: number) => {
    if (blockedBySubmission(hasSubmittedResults, isRevealing)) return;
    let A: Team, B: Team;
    switch (matchNum) {
      case 1:
        A = team2;
        B = team3;
        break;
      case 2:
        if (!matchResults[1].winner) {
          return message.error("Complete Match 1 first.");
        }
        A = matchResults[1].winner;
        B = team1;
        break;
      case 3:
        if (!matchResults[1].loser || !matchResults[2].loser) {
          return message.error("Need losers from Match 1 and 2 first.");
        }
        A = matchResults[2].loser;
        B = matchResults[1].loser;
        break;
      case 4:
        if (!matchResults[2].winner || !matchResults[3].winner) {
          return message.error("Need winners from Semifinal and Losers Final.");
        }
        A = matchResults[2].winner;
        B = matchResults[3].winner;
        break;
      case 5:
        if (!matchResults[4].winner || !matchResults[4].loser)
          return message.error("Complete Grand Final first.");
        // champion already decided - reopen the deciding match so a
        // misclicked winner can still be corrected with the lock code
        if (isSameTeam(matchResults[4].winner, matchResults[2].winner!)) {
          setModalTeams({
            A: matchResults[4].winner,
            B: matchResults[4].loser,
          });
          setSelectedWinner(null);
          setCurrentMatch(4);
          setIsModalOpen(true);
          return;
        }
        // otherwise reset final
        A = matchResults[4].winner!;
        B = matchResults[4].loser!;
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

  const semiWinner = matchResults[2]?.winner;
  const grandWinner = matchResults[4]?.winner;
  const resetWinner = matchResults[5]?.winner;
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

        {/* Semifinals */}
        <div className="match-cell lower-line" style={{ height: "69px" }}>
          <TeamSlot
            value={renderTeamName(team1)}
            title="1 Seed"
          />
          <TeamSlot
            value={renderTeamName(matchResults[1].winner)}
            placeholder="Winner of 1"
            title={
              renderTeamName(matchResults[1].winner) ? "Winner of 1" : undefined
            }
          />

          <span className="match-number">
            Match 2 <TrophyFilled onClick={() => showModal(2)} />
          </span>
        </div>

        {/* Finals / Championship placeholder */}
        <div className="match-cell lower-match-col">
          <TeamSlot
            value={renderTeamName(matchResults[2].winner)}
            placeholder="Winner of 2"
            title={
              renderTeamName(matchResults[2].winner) ? "Winner of 2" : undefined
            }
          />
          <TeamSlot
            value={renderTeamName(matchResults[3].winner)}
            placeholder="Winner of Losers"
            title={
              renderTeamName(matchResults[3].winner)
                ? "Winner of Losers"
                : undefined
            }
          />
          <span className="match-number">
            Match 4 <TrophyFilled onClick={() => showModal(4)} />
          </span>
        </div>

        {needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col no-dash">
              <TeamSlot
                value={renderTeamName(matchResults[4].winner)}
                placeholder="winner of 4"
                title={
                  renderTeamName(matchResults[4].winner)
                    ? "Winner of 4"
                    : undefined
                }
              />
              <TeamSlot
                value={renderTeamName(matchResults[4].loser)}
                placeholder="loser of 4 (if necessary)"
                title={
                  renderTeamName(matchResults[4].loser)
                    ? "loser of 4"
                    : undefined
                }
              />
              <span className="match-number">
                Match 5 <TrophyFilled onClick={() => showModal(5)} />
              </span>
            </div>
          </div>
        ) : (
          <div className="match-row">
            <div className="match-cell lower-match-col no-dash">
              <h1>?</h1>
            </div>
          </div>
        )}
      </div>

      {/* Bottom row headers */}
      <div className="header-row losers-headers">
        <div className="column-header"></div>
        <div className="column-header">Losers Finals</div>
      </div>

      {/* Bottom row matches */}
      <div className="match-row bottom-row">
        <div className="match-cell placeholder"></div>

        {/* Losers finals 2 */}
        <div className="match-cell upper-line angle-up65">
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
            Match 3 <TrophyFilled onClick={() => showModal(3)} />
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
