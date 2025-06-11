interface FiveTeamBracketProps {
  teams: [string, string][] | null;
}

export default function FiveTeamBracket({ teams }: FiveTeamBracketProps) {
  if (!teams) return <h2 style={{ color: "white" }}>Waiting on teams...</h2>;

  if (teams) {
    console.log("teams in 5teamsgracket", teams);
  }
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
            value={`${teams[3][0]} & ${teams[3][1]}`}
            readOnly
          />
          <input
            className="team-input"
            value={`${teams[4][0]} & ${teams[4][1]}`}
            readOnly
          />
          <span className="match-number">Match 1</span>
        </div>

        {/* round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-line">
            <input
              className="team-input"
              value={`${teams[0][0]} & ${teams[0][1]}`}
              readOnly
            />
            <input className="team-input" placeholder="Winner of 1" readOnly />
            <span className="match-number">Match 3</span>
          </div>

          <div className="match-cell upper-line">
            <input
              className="team-input"
              value={`${teams[1][0]} & ${teams[1][1]}`}
              readOnly
            />
            <input
              className="team-input"
              value={`${teams[2][0]} & ${teams[2][1]}`}
              readOnly
            />
            <span className="match-number">Match 2</span>
          </div>
        </div>

        <div className="match-cell lower-line lower-match-col">
          <input className="team-input" placeholder="Winner of 3" readOnly />
          <input className="team-input" placeholder="Winner of 2" readOnly />
          <span className="match-number">Match 6</span>
        </div>

        <div className="match-cell lower-match-col2">
          <input className="team-input" placeholder="Winner of 6" readOnly />
          <input
            className="team-input"
            placeholder="Winner of losers"
            readOnly
          />
          <span className="match-number">Match 8</span>
        </div>

        <div className="match-cell lower-match-col2 no-dash">
          <input className="team-input" placeholder="" readOnly />
          <input
            className="team-input"
            placeholder="Loser of 8 (if necessary)"
            readOnly
          />
          <span className="match-number">Match 9</span>
        </div>
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
          <input className="team-input" placeholder="Loser of 2" readOnly />
          <input className="team-input" placeholder="Loser of 1" readOnly />
          <span className="match-number">Match 4</span>
        </div>

        {/* Losers Round 2 */}
        <div className="match-cell lower-match-col upper-line single-cell">
          <input className="team-input" placeholder="Loser of 3" readOnly />
          <input className="team-input" placeholder="Winner of 4" readOnly />
          <span className="match-number">Match 5</span>
        </div>

        <div className="match-cell upper-line angle-up65 single-cell">
          <input className="team-input" placeholder="Loser of 6" readOnly />
          <input className="team-input" placeholder="Winner of 5" readOnly />
          <span className="match-number">Match 5</span>
        </div>
      </div>
    </div>
  );
}
