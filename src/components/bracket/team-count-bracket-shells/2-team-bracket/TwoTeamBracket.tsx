export default function TwoTeamBracket() {
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
            <input className="team-input" placeholder="Team 1" />
            <input className="team-input" placeholder="Team 2" />
            <span className="match-number">Match 1</span>
          </div>
        </div>

        {/* Finals / Championship placeholder */}
        <div className="match-cell lower-match-col">
          <input className="team-input" placeholder="" />
          <input className="team-input" placeholder="Loser of 1" />
          <span className="match-number">Match 2</span>
        </div>

        <div className="match-cell lower-match-col no-dash">
          <input className="team-input" placeholder="" />
          <input
            className="team-input"
            placeholder="Loser of 2 (if necessary)"
          />
          <span className="match-number">Match 3</span>
        </div>
      </div>
    </div>
  );
}
