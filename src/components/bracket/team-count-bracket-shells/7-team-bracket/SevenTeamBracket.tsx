export default function SevenTeamBracket() {
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
            <input className="team-input" placeholder="Team 4" />
            <input className="team-input" placeholder="Team 5" />
            <span className="match-number">Match 1</span>
          </div>

          <div className="match-cell lower-line">
            <input className="team-input" placeholder="Team 2" />
            <input className="team-input" placeholder="Team 7" />
            <span className="match-number">Match 2</span>
          </div>

          <div className="match-cell upper-line">
            <input className="team-input" placeholder="Team 3" />
            <input className="team-input" placeholder="Team 6" />
            <span className="match-number">Match 3</span>
          </div>
        </div>

        {/* round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-line angle-down45">
            <input className="team-input" placeholder="Team 1" />
            <input className="team-input" placeholder="Winner of 1" />
            <span className="match-number">Match 5</span>
          </div>

          <div className="match-cell lower-match-col2 upper-line angle-up45">
            <input className="team-input" placeholder="Winner of 2" />
            <input className="team-input" placeholder="Winner of 3" />
            <span className="match-number">Match 6</span>
          </div>
        </div>

        <div className="match-cell lower-line lower-match-col2">
          <input className="team-input" placeholder="Winner of 5" />
          <input className="team-input" placeholder="Winner of 6" />
          <span className="match-number">Match 10</span>
        </div>

        <div className="match-cell lower-match-col3">
          <input className="team-input" placeholder="Winner of 10" />
          <input className="team-input" placeholder="Winner of losers" />
          <span className="match-number">Match 12</span>
        </div>

        <div className="match-cell lower-match-col3 no-dash">
          <input className="team-input" placeholder="" />
          <input
            className="team-input"
            placeholder="Loser of 12 (if necessary)"
          />
          <span className="match-number">Match 13</span>
        </div>
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
          <input className="team-input" placeholder="Loser of 2" />
          <input className="team-input" placeholder="Loser of 3" />
          <span className="match-number">Match 4</span>
        </div>

        {/* Losers Round 2 */}
        <div className="round1-column">
          <div className="match-cell lower-line single-cell">
            <input className="team-input" placeholder="Loser of 6" />
            <input className="team-input" placeholder="Loser of 1" />
            <span className="match-number">Match 8</span>
          </div>

          <div className="match-cell upper-line single-cell">
            <input className="team-input" placeholder="Loser of 5" />
            <input className="team-input" placeholder="Winner of 4" />
            <span className="match-number">Match 7</span>
          </div>
        </div>

        {/* Losers Round 3 */}
        <div className="match-cell lower-match-col upper-line single-cell">
          <input className="team-input" placeholder="Winner of 8" />
          <input className="team-input" placeholder="Winner of 7" />
          <span className="match-number">Match 9</span>
        </div>

        <div className="match-cell upper-line angle-up90 single-cell">
          <input className="team-input" placeholder="Loser of 10" />
          <input className="team-input" placeholder="Winner of 9" />
          <span className="match-number">Match 9</span>
        </div>
      </div>
    </div>
  );
}
