interface TwoTeamBracketProps {
  teams: [string, string][] | null; // exactly 2 teams of 2
}
import { TrophyFilled } from "@ant-design/icons";

export default function TwoTeamBracket({ teams }: TwoTeamBracketProps) {
  if (!teams) return <h2 style={{ color: "white" }}>Waiting on teams...</h2>;

  if (teams) {
    console.log("teams in 2teamsgracket", teams);
  }

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
              value={`${teams[0][0]} & ${teams[0][1]}`}
              readOnly
            />
            <input
              className="team-input"
              value={`${teams[1][0]} & ${teams[1][1]}`}
              readOnly
            />
            <span className="match-number">
              Match 1 <TrophyFilled />
            </span>
          </div>
        </div>

        {/* Finals / Championship placeholder */}
        <div className="match-cell lower-match-col">
          <input className="team-input" placeholder="" readOnly />
          <input className="team-input" placeholder="Loser of 1" readOnly />
          <span className="match-number">Match 2</span>
        </div>

        <div className="match-cell lower-match-col no-dash">
          <input className="team-input" placeholder="" readOnly />
          <input
            className="team-input"
            placeholder="Loser of 2 (if necessary)"
            readOnly
          />
          <span className="match-number">Match 3</span>
        </div>
      </div>
    </div>
  );
}
