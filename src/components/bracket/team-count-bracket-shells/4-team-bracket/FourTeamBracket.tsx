// import "./fourTeamBracket.css";

export default function FourTeamBracket() {
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
            <input className="team-input" placeholder="Team 1" />
            <input className="team-input" placeholder="Team 4" />
            <span className="match-number">Match 1</span>
          </div>
          <div className="match-cell upper-line">
            <input className="team-input" placeholder="Team 2" />
            <input className="team-input" placeholder="Team 3" />
            <span className="match-number">Match 2</span>
          </div>
        </div>

        {/* Semifinals */}
        <div className="match-cell lower-match-col lower-line">
          <input className="team-input" placeholder="Winner of 1" />
          <input className="team-input" placeholder="Winner of 2" />
          <span className="match-number">Match 4</span>
        </div>

        {/* Finals / Championship placeholder */}
        <div className="match-cell lower-match-col2">
          <input className="team-input" placeholder="Winner of 4" />
          <input className="team-input" placeholder="Winner of Losers" />
          <span className="match-number">Match 6</span>
        </div>

        <div className="match-cell lower-match-col2 no-dash">
          <input className="team-input" placeholder="Winner of 6" />
          <input
            className="team-input"
            placeholder="Loser of 6 (if necessary)"
          />
          <span className="match-number">Match 7</span>
        </div>
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
          <input className="team-input" placeholder="Loser of 1" />
          <input className="team-input" placeholder="Loser of 2" />
          <span className="match-number">Match 3</span>
        </div>

        {/* Losers Round 2 */}
        <div className="match-cell upper-line angle-up65 single-cell">
          <input className="team-input" placeholder="Loser of 4" />
          <input className="team-input" placeholder="Winner of 3" />
          <span className="match-number">Match 5</span>
        </div>
      </div>
    </div>
  );
}
