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

interface SevenTeamBracketProps {
  teams: [PlayerFromDB, PlayerFromDB][] | null;
  matchResults: MatchResult[];
  onChange: (newResults: MatchResult[]) => void;
}

interface MatchResult {
  winner: string | null;
  loser: string | null;
}

export default function SevenTeamBracket({
  teams,
  matchResults,
  onChange,
}: SevenTeamBracketProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<number | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [modalTeams, setModalTeams] = useState<{ A: string; B: string } | null>(
    null
  );

  if (!teams) return <h2 style={{ color: "white" }}>Waiting on teams...</h2>;

  if (teams) {
    console.log("teams in 7teamsgracket", teams);
  }

  const team1 = `${teams[0][0]} & ${teams[0][1]}`;
  const team2 = `${teams[1][0]} & ${teams[1][1]}`;
  const team3 = `${teams[2][0]} & ${teams[2][1]}`;
  const team4 = `${teams[3][0]} & ${teams[3][1]}`;
  const team5 = `${teams[4][0]} & ${teams[4][1]}`;
  const team6 = `${teams[5][0]} & ${teams[5][1]}`;
  const team7 = `${teams[6][0]} & ${teams[6][1]}`;

  // Helper to open modal for any match
  const showModal = (matchNum: number) => {
    // determine the two competing teams
    let A = "",
      B = "";
    switch (matchNum) {
      case 1:
        A = team4;
        B = team5;
        break;
      case 2:
        A = team2;
        B = team7;
        break;
      case 3:
        if (!matchResults[1].winner) {
          return message.error("Need winner from Match 1 first.");
        }
        A = team3;
        B = team6;
        break;
      case 4:
        if (!matchResults[2].loser || !matchResults[3].loser) {
          return message.error("Need loser from Match 2 & 3 first.");
        }
        A = matchResults[2].loser;
        B = matchResults[3].loser;
        break;
      case 5:
        if (!matchResults[1].winner) {
          return message.error("Need loser from Match 3 & 2 first.");
        }
        A = team1;
        B = matchResults[1].winner;
        break;
      case 6:
        if (!matchResults[2].winner || !matchResults[3].winner) {
          return message.error("Need winners from Match 2 & 3 first.");
        }
        A = matchResults[2].winner;
        B = matchResults[3].winner;
        break;
      case 7:
        if (!matchResults[5].loser || !matchResults[4].winner) {
          return message.error(
            "Need winner from Match 4 & loser from 5 first."
          );
        }
        A = matchResults[5].loser;
        B = matchResults[4].winner;
        break;
      case 8:
        if (!matchResults[6].loser || !matchResults[1].loser) {
          return message.error("Need winner from Match 6 & 5 first.");
        }
        A = matchResults[6].loser;
        B = matchResults[1].loser;
        break;
      case 9:
        if (!matchResults[8].winner || !matchResults[7].winner) {
          return message.error("Need winner of 8 & 7 first.");
        }
        A = matchResults[8].winner;
        B = matchResults[7].winner;
        break;
      case 10:
        if (!matchResults[5].winner || !matchResults[6].winner) {
          return message.error("Need winner from Match 5 & 6 first.");
        }
        A = matchResults[5].winner;
        B = matchResults[6].winner;
        break;
      case 11:
        if (!matchResults[10].loser || !matchResults[9].winner) {
          return message.error("Need winner from Match 9 & loser of 10 first.");
        }
        A = matchResults[10].loser;
        B = matchResults[9].winner;
        break;
      case 12:
        if (!matchResults[10].winner || !matchResults[11].winner) {
          return message.error(
            "Need winner from Match 10 & Losers Bracket first."
          );
        }
        A = matchResults[10].winner;
        B = matchResults[11].winner;
        break;
      case 13:
        if (!matchResults[12].winner || !matchResults[12].loser)
          return message.error("Complete Grand Final first.");
        // if winners-bracket champ wins GF, tournament ends
        if (matchResults[12].winner === matchResults[10].winner)
          return message.info("Tournament is over — no reset final needed.");
        // otherwise reset final
        A = matchResults[12].winner;
        B = matchResults[12].loser;
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
  const grandWinner = matchResults[12].winner;
  const needsReset = grandWinner && grandWinner !== matchResults[10].winner;
  const tournamentOver = grandWinner && !needsReset;
  const resetWinner = matchResults[13].winner;
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
          <div className="match-cell lower-match-col upper-line">
            <input className="team-input" value={team4} readOnly />
            <input className="team-input" value={team5} readOnly />
            <span className="match-number">
              Match 1 <TrophyFilled onClick={() => showModal(1)} />
            </span>
          </div>

          <div className="match-cell lower-line">
            <input className="team-input" value={team2} readOnly />
            <input className="team-input" value={team7} readOnly />
            <span className="match-number">
              Match 2 <TrophyFilled onClick={() => showModal(2)} />
            </span>
          </div>

          <div className="match-cell upper-line">
            <input className="team-input" value={team3} readOnly />
            <input className="team-input" value={team6} readOnly />
            <span className="match-number">
              Match 2 <TrophyFilled onClick={() => showModal(3)} />
            </span>
          </div>
        </div>

        {/* round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-line angle-down45">
            <input className="team-input" value={team1} readOnly />
            <input
              className="team-input"
              placeholder="Winner of 1"
              value={matchResults[1].winner ?? ""}
              readOnly
            />
            <span className="match-number">
              Match 5 <TrophyFilled onClick={() => showModal(5)} />
            </span>
          </div>

          <div className="match-cell lower-match-col2 upper-line angle-up45">
            <input
              className="team-input"
              placeholder="Winner of 2"
              value={matchResults[2].winner ?? ""}
              readOnly
            />
            <input
              className="team-input"
              placeholder="Winner of 3"
              value={matchResults[3].winner ?? ""}
              readOnly
            />
            <span className="match-number">
              Match 6 <TrophyFilled onClick={() => showModal(6)} />
            </span>
          </div>
        </div>

        <div className="match-cell lower-line lower-match-col2">
          <input
            className="team-input"
            placeholder="Winner of 5"
            value={matchResults[5].winner ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of 6"
            value={matchResults[6].winner ?? ""}
            readOnly
          />
          <span className="match-number">
            Match 10 <TrophyFilled onClick={() => showModal(10)} />
          </span>
        </div>

        <div className="match-cell lower-match-col3">
          <input
            className="team-input"
            placeholder="Winner of 10"
            value={matchResults[10].winner ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of losers"
            value={matchResults[11].winner ?? ""}
            readOnly
          />
          <span className="match-number">
            Match 12 <TrophyFilled onClick={() => showModal(12)} />
          </span>
        </div>

        {tournamentOver ? (
          <div className="match-row final-row">
            <div className="match-cell lower-match-col3 champ-cell no-dash">
              <div className="champion-text">{grandWinner} won!</div>
            </div>
          </div>
        ) : needsReset ? (
          <div className="match-row">
            <div className="match-cell lower-match-col3">
              <input
                className="team-input"
                value={matchResults[12].winner ?? ""}
                placeholder="Winner of 12"
                readOnly
              />
              <input
                className="team-input"
                value={matchResults[12].loser ?? ""}
                placeholder="Loser of 12 (if necessary)"
                readOnly
              />
              <span className="match-number">
                Match 13 <TrophyFilled onClick={() => showModal(13)} />
              </span>
            </div>
            {resetWinner && (
              <div className="match-row final-row">
                <div className="match-cell lower-match-col3 no-dash">
                  <div className="champion-text">{resetWinner} won!</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="match-row">
            <div className="match-cell lower-match-col3 no-dash">
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
        {/* Losers Round 1 */}
        <div className="match-cell lower-match-col2 upper-line">
          <input
            className="team-input"
            placeholder="Loser of 2"
            value={matchResults[2].loser ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Loser of 3"
            value={matchResults[3].loser ?? ""}
            readOnly
          />
          <span className="match-number">
            Match 4 <TrophyFilled onClick={() => showModal(4)} />
          </span>
        </div>

        {/* Losers Round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-line single-cell">
            <input
              className="team-input"
              placeholder="Loser of 6"
              value={matchResults[6].loser ?? ""}
              readOnly
            />
            <input
              className="team-input"
              placeholder="Loser of 1"
              value={matchResults[1].loser ?? ""}
              readOnly
            />
            <span className="match-number">
              Match 8 <TrophyFilled onClick={() => showModal(8)} />
            </span>
          </div>

          <div className="match-cell upper-line single-cell">
            <input
              className="team-input"
              placeholder="Loser of 5"
              value={matchResults[5].loser ?? ""}
              readOnly
            />
            <input
              className="team-input"
              placeholder="Winner of 4"
              value={matchResults[4].winner ?? ""}
              readOnly
            />
            <span className="match-number">
              Match 7 <TrophyFilled onClick={() => showModal(7)} />
            </span>
          </div>
        </div>

        {/* Losers Round 3 */}
        <div className="match-cell lower-match-col upper-line single-cell">
          <input
            className="team-input"
            placeholder="Winner of 8"
            value={matchResults[8].winner ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of 7"
            value={matchResults[7].winner ?? ""}
            readOnly
          />
          <span className="match-number">
            Match 9 <TrophyFilled onClick={() => showModal(9)} />
          </span>
        </div>

        <div className="match-cell upper-line angle-up90 single-cell">
          <input
            className="team-input"
            placeholder="Loser of 10"
            value={matchResults[10].loser ?? ""}
            readOnly
          />
          <input
            className="team-input"
            placeholder="Winner of 9"
            value={matchResults[9].winner ?? ""}
            readOnly
          />
          <span className="match-number">
            Match 11 <TrophyFilled onClick={() => showModal(11)} />
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
