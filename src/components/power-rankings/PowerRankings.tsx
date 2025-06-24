import { PlayerFromDB, OutletContext } from "../../types";
import { useOutletContext } from "react-router-dom";
import "./powerRankings.css";
import { TrophyCell } from "./RenderTrophies";
interface RankedPlayer extends PlayerFromDB {
  rank: number;
}

const sortAndRankData = (data: PlayerFromDB[]): RankedPlayer[] => {
  // copy + sort by descending score
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  let currentRank = 0;
  let lastScore: number | null = null;

  return sortedData.map((player, idx) => {
    if (player.score !== lastScore) {
      currentRank = idx + 1;
      lastScore = player.score;
    }
    return { ...player, rank: currentRank };
  });
};

export default function PowerRankings() {
  const { players } = useOutletContext<OutletContext>();

  if (players.length === 0) {
    return (
      <div className="main-container">
        <div className="powerrankings-container">
          <h1 className="powerrankings-title">Rankings</h1>
          <div
            style={{
              backgroundColor: "black",
              height: "100vh",
              width: "100%",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="powerrankings-page">
      <div className="main-container">
        <div className="powerrankings-container">
          <h1 className="powerrankings-title">Rankings</h1>
          <table className="power-table">
            <thead className="power-table-thead">
              <tr className="power-head-row">
                <th className="power-table-cell">Name</th>
                <th className="power-table-cell">Rank</th>
                <th className="power-table-cell">Score</th>
                <th>Titles</th>
              </tr>
            </thead>
            <tbody className="power-table-tbody">
              {sortAndRankData(players).map((p) => (
                <tr key={p.id} className="power-row">
                  <td className="power-table-cell">
                    <span className="power-glass">{p.name}</span>
                  </td>
                  <td className="power-table-cell">
                    <span className="rank-badge">{p.rank}</span>
                  </td>
                  <td className="power-table-cell">
                    <span className="power-glass">{p.score}</span>
                  </td>
                  <TrophyCell count={p.championships} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
