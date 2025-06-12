import { TrophyFilled } from "@ant-design/icons";
import { Modal, Radio, message } from "antd";
import { useState } from "react";
import Confetti from "../../confetti";
interface TwoTeamBracketProps {
  teams: [string, string][] | null; // exactly 2 teams of 2
}

interface MatchResult {
  winner: string | null;
  loser: string | null;
}

export default function TwoTeamBracket({ teams }: TwoTeamBracketProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<number | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [modalTeams, setModalTeams] = useState<{ A: string; B: string } | null>(
    null
  );

  // Track results for matches 1-5
  const [matchResults, setMatchResults] = useState<MatchResult[]>([
    { winner: null, loser: null }, // index 0 unused
    { winner: null, loser: null }, // Match 1
    { winner: null, loser: null }, // Match 2 (finals)
    { winner: null, loser: null }, // Match 3 (Reset Final)
  ]);

  if (!teams) return <h2 style={{ color: "white" }}>Waiting on teams...</h2>;

  const team1 = `${teams[0][0]} & ${teams[0][1]}`;
  const team2 = `${teams[1][0]} & ${teams[1][1]}`;

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
        if (!matchResults[1].winner) {
          return message.error("Complete Match 1 first.");
        }
        if (matchResults[1].winner === matchResults[2].winner) {
          return message.info("Tournament is over — no reset final needed.");
        }
        A = matchResults[1].winner;
        B = matchResults[1].loser ?? "";
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
    setSelectedWinner(A);
    setCurrentMatch(matchNum);
    setIsModalOpen(true);
  };

  // Handle clicking "Submit Winner"
  const handleOk = () => {
    if (currentMatch && selectedWinner && modalTeams) {
      const loser =
        selectedWinner === modalTeams.A ? modalTeams.B : modalTeams.A;
      setMatchResults((prev) => {
        const copy = [...prev];
        copy[currentMatch] = { winner: selectedWinner, loser };
        return copy;
      });
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
  const grandWinner = matchResults[2].winner;
  const needsReset = grandWinner && grandWinner !== matchResults[1].winner;
  const tournamentOver = grandWinner && !needsReset;
  const resetWinner = matchResults[3].winner;

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
            <input className="team-input" value={team1} readOnly />
            <input className="team-input" value={team2} readOnly />
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
            value={matchResults[1].winner ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Loser of 1"
            value={matchResults[1].loser ?? ""}
            readOnly
          />
          <span className="match-number">
            Match 2 <TrophyFilled onClick={() => showModal(2)} />
          </span>
        </div>

        {tournamentOver ? (
          <div className="match-row final-row">
            <div className="match-cell lower-match-col champ-cell no-dash">
              <div className="champion-text">{grandWinner} won!</div>
            </div>
          </div>
        ) : needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col">
              <input
                className="team-input"
                value={matchResults[2].winner ?? ""}
                placeholder="winner of 2"
                readOnly
              />
              <input
                className="team-input"
                value={matchResults[2].loser ?? ""}
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
                  <div className="champion-text">{resetWinner} won!</div>
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
      <Modal
        title="Who Won?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        okText="Submit Winner"
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
