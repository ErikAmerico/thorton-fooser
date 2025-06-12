import { TrophyFilled } from "@ant-design/icons";
import { Modal, Radio, message } from "antd";
import { useState, useEffect } from "react";
import Confetti from "../../confetti";

interface ThreeTeamBracketProps {
  teams: [string, string][] | null;
}

interface MatchResult {
  winner: string | null;
  loser: string | null;
}

export default function ThreeTeamBracket({ teams }: ThreeTeamBracketProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<number | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [modalTeams, setModalTeams] = useState<{ A: string; B: string } | null>(
    null
  );

  useEffect(() => {
    if (window.innerWidth < 768) {
      message.warning("Brackets are best viewed in Landscape Mode", 5);
    }
  }, []);

  // Track results for matches 1-5
  const [matchResults, setMatchResults] = useState<MatchResult[]>([
    { winner: null, loser: null }, // index 0 unused
    { winner: null, loser: null }, // Match 1
    { winner: null, loser: null }, // Match 2
    { winner: null, loser: null }, // Match 3 (Losers Final)
    { winner: null, loser: null }, // Match 4 (Grand Final)
    { winner: null, loser: null }, // Match 5 (Reset Final)
  ]);

  if (!teams) return <h2 style={{ color: "white" }}>Waiting on teams...</h2>;

  if (teams) {
    console.log("teams in 3teamsgracket", teams);
  }

  const team1 = `${teams[0][0]} & ${teams[0][1]}`;
  const team2 = `${teams[1][0]} & ${teams[1][1]}`;
  const team3 = `${teams[2][0]} & ${teams[2][1]}`;

  // Helper to open modal for any match
  const showModal = (matchNum: number) => {
    // determine the two competing teams
    let A = "",
      B = "";
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
        // if winners-bracket champ wins GF, tournament ends
        if (matchResults[4].winner === matchResults[2].winner)
          return message.info("Tournament is over — no reset final needed.");
        // otherwise reset final
        A = matchResults[4].winner!;
        B = matchResults[4].loser!;
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
  const grandWinner = matchResults[4].winner;
  const needsReset = grandWinner && grandWinner !== matchResults[2].winner;
  const tournamentOver = grandWinner && !needsReset;
  const resetWinner = matchResults[5].winner;

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
          <div className="match-cell lower-line">
            <input className="team-input" value={team2} readOnly />
            <input className="team-input" value={team3} readOnly />
            <span className="match-number">
              Match 1 <TrophyFilled onClick={() => showModal(1)} />
            </span>
          </div>
        </div>

        {/* Semifinals */}
        <div className="match-cell lower-match-col lower-line">
          <input
            className="team-input"
            value={matchResults[1].winner ?? ""}
            placeholder="Winner of 1"
            readOnly
          />
          <input className="team-input" value={team1} readOnly />
          <span className="match-number">
            Match 2 <TrophyFilled onClick={() => showModal(2)} />
          </span>
        </div>

        {/* Finals / Championship placeholder */}
        <div className="match-cell lower-match-col2">
          <input
            className="team-input"
            value={matchResults[2].winner ?? ""}
            placeholder="Winner of 2"
            readOnly
          />
          <input
            className="team-input"
            value={matchResults[3].winner ?? ""}
            placeholder="Winner of Losers"
            readOnly
          />
          <span className="match-number">
            Match 4 <TrophyFilled onClick={() => showModal(4)} />
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
                value={matchResults[4].winner ?? ""}
                placeholder="winner of 4"
                readOnly
              />
              <input
                className="team-input"
                value={matchResults[4].loser ?? ""}
                placeholder="loser of 4 (if necessary)"
                readOnly
              />
              <span className="match-number">
                Match 5 <TrophyFilled onClick={() => showModal(5)} />
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
        <div className="column-header"></div>
        <div className="column-header">Losers Finals</div>
      </div>

      {/* Bottom row matches */}
      <div className="match-row bottom-row">
        <div className="match-cell placeholder"></div>

        {/* Losers finals 2 */}
        <div className="match-cell upper-line angle-up65">
          <input
            className="team-input"
            placeholder="Loser of 2"
            value={matchResults[2].loser ?? ""}
            readOnly
          />
          <input
            className="team-input"
            value={matchResults[1].loser ?? ""}
            placeholder="Loser of 1"
            readOnly
          />
          <span className="match-number">
            Match 3 <TrophyFilled onClick={() => showModal(3)} />
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
