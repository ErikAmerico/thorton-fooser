import { TrophyFilled } from "@ant-design/icons";
import { Modal, Radio, message } from "antd";
import { useState } from "react";
import Confetti from "../../confetti";

interface PlayerFromDB {
  id: string;
  name: string;
  score: number;
  hint: string;
}

interface FourTeamBracketProps {
  teams: [PlayerFromDB, PlayerFromDB][] | null;
  matchResults: MatchResult[];
  onChange: (newResults: MatchResult[]) => void;
}

interface MatchResult {
  winner: string | null;
  loser: string | null;
}

export default function FourTeamBracket({
  teams,
  matchResults,
  onChange,
}: FourTeamBracketProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<number | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [modalTeams, setModalTeams] = useState<{ A: string; B: string } | null>(
    null
  );

  if (!teams) return <h2 style={{ color: "white" }}>Waiting on teams...</h2>;

  if (teams) {
    console.log("teams in 4teamsgracket", teams);
  }

  const team1 = `${teams[0][0]} & ${teams[0][1]}`;
  const team2 = `${teams[1][0]} & ${teams[1][1]}`;
  const team3 = `${teams[2][0]} & ${teams[2][1]}`;
  const team4 = `${teams[3][0]} & ${teams[3][1]}`;

  // Helper to open modal for any match
  const showModal = (matchNum: number) => {
    // determine the two competing teams
    let A = "",
      B = "";
    switch (matchNum) {
      case 1:
        A = team1;
        B = team2;
        break;
      case 2:
        A = team3;
        B = team4;
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

  // Handle clicking "Submit Winner"
  const handleOk = () => {
    if (currentMatch && selectedWinner && modalTeams) {
      const loser =
        selectedWinner === modalTeams.A ? modalTeams.B : modalTeams.A;
      const newResults = [...matchResults];
      newResults[currentMatch] = { winner: selectedWinner, loser };
      onChange(newResults);
      console.log("selectedWinner", selectedWinner);
    }
    setIsModalOpen(false);
    setCurrentMatch(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentMatch(null);
  };

  // Determine champion if tournament ended
  const grandWinner = matchResults[6].winner;
  const needsReset = grandWinner && grandWinner !== matchResults[4].winner;
  const tournamentOver = grandWinner && !needsReset;
  const resetWinner = matchResults[7].winner;

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
            <input className="team-input" value={team1} readOnly />
            <input className="team-input" value={team2} readOnly />
            <span className="match-number">
              Match 1 <TrophyFilled onClick={() => showModal(1)} />{" "}
            </span>
          </div>
          <div className="match-cell upper-line">
            <input className="team-input" value={team3} readOnly />
            <input className="team-input" value={team4} readOnly />
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
            value={matchResults[1].winner ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of 2"
            value={matchResults[2].winner ?? ""}
            readOnly
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
            value={matchResults[4].winner ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of Losers"
            value={matchResults[5].winner ?? ""}
            readOnly
          />
          <span className="match-number">
            Match 6 <TrophyFilled onClick={() => showModal(6)} />
          </span>
        </div>

        {tournamentOver ? (
          <div className="match-row final-row">
            <div className="match-cell lower-match-col2 champ-cell no-dash">
              <div className="champion-text">{grandWinner} won!</div>
            </div>
          </div>
        ) : needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col2">
              <input
                className="team-input"
                value={matchResults[6].winner ?? ""}
                placeholder="winner of 6"
                readOnly
              />
              <input
                className="team-input"
                value={matchResults[6].loser ?? ""}
                placeholder="loser of 6 (if necessary)"
                readOnly
              />
              <span className="match-number">
                Match 7 <TrophyFilled onClick={() => showModal(7)} />
              </span>
            </div>
            {resetWinner && (
              <div className="match-row final-row">
                <div className="match-cell lower-match-col2 no-dash">
                  <div className="champion-text">{resetWinner} won!</div>
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
            value={matchResults[1].loser ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Loser of 2"
            value={matchResults[2].loser ?? ""}
            readOnly
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
            value={matchResults[4].loser ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of 3"
            value={matchResults[3].winner ?? ""}
            readOnly
          />
          <span className="match-number">
            Match 5 <TrophyFilled onClick={() => showModal(5)} />
          </span>
        </div>
      </div>
      <Modal
        title="Who Won?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        okText="Submit Winner"
        okButtonProps={{ disabled: !selectedWinner }}
        style={{ textAlign: "center" }}
      >
        <Radio.Group
          onChange={(e) => setSelectedWinner(e.target.value)}
          value={selectedWinner}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {modalTeams && (
            <>
              <Radio value={modalTeams.A}>{modalTeams.A}</Radio>
              <Radio value={modalTeams.B}>{modalTeams.B}</Radio>
            </>
          )}
        </Radio.Group>
      </Modal>
      {!needsReset && grandWinner && <Confetti />}
      {resetWinner && <Confetti />}
    </div>
  );
}
