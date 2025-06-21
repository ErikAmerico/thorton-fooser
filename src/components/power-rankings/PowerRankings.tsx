import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlayerFromDB, OutletContext } from "../../types";
import { useOutletContext } from "react-router-dom";
import { mockPlayers } from "../../data/mockData";
import "./powerRankings.css";

interface RankedPlayer extends PlayerFromDB {
  rank: number;
}

const columns: ColumnsType<PlayerFromDB> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "Score",
    dataIndex: "score",
    key: "score",
  },
];

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

  // useEffect(() => {
  //   setPlayers(mockPlayers);
  // }, []);

  if (players.length === 0) {
    return (
      <div className="main-container">
        <div className="powerrankings-container">
          <h1 className="powerrankings-title">Rankings</h1>
          <div
            style={{
              backgroundColor: "white",
              height: "100vh",
              width: "100%",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="powerrankings-container">
        <h1 className="powerrankings-title">Rankings</h1>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={sortAndRankData(players)}
          pagination={false}
        />
      </div>
    </div>
  );
}
