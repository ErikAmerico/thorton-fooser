import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./powerRankings.css";

const columns: ColumnsType<Player> = [
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

interface Player {
  key: string;
  name: string;
  score: number;
  rank?: number;
}

const rawData = [
  { key: "michelles", name: "Michelle", score: 18 },
  { key: "ofir", name: "Ofir", score: 24 },
  { key: "brickwall", name: "Brittany", score: 14 },
  { key: "erik", name: "Erik", score: 17 },
  { key: "dray", name: "Andraya", score: 11.5 },
  { key: "anna", name: "Anna", score: 9 },
  { key: "mattsarissa", name: "Matt", score: 6.5 },
  { key: "stevem", name: "Steve", score: 2 },
  { key: "sarahsteve", name: "Sarah", score: 2 },
  { key: "zachsmith", name: "Zach Smith", score: 2 },
  { key: "tommyb", name: "Tommy", score: 3 },
  { key: "danrachel", name: "Dan", score: 5 },
  { key: "rachelj", name: "Rachel Jobe", score: 4 },
  { key: "ari", name: "Ari", score: 2 },
  { key: "andyp", name: "Andy P", score: 3 },
  { key: "karach", name: "Kara", score: 1 },
  { key: "cj", name: "CJ", score: 2 },
  { key: "kellyV", name: "Kelly", score: 1 },
  { key: "sarissa", name: "Sarissa", score: 1 },
  { key: "lindsay", name: "Lindsay", score: 1 },
  { key: "BryanCJ", name: "Bryan", score: 3 },
  { key: "jakeRos", name: "Jake R", score: 3 },
  { key: "mattdalton", name: "Matt D", score: 3 },
  { key: "caseymoran", name: "Casey", score: 3 },
  { key: "rachellan", name: "Rachel Richards", score: 6 },
  { key: "monicatommy", name: "Monica", score: 6 },
  { key: "cooperrich", name: "Cooper", score: 3 },
];

const sortAndRankData = (data: Player[]): Player[] => {
  // Make a copy so we don't mutate the original:
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  let rank = 0;
  let prevScore: number | null = null;

  sortedData.forEach((item, idx) => {
    if (item.score !== prevScore) {
      rank = idx + 1;
    }
    item.rank = rank;
    prevScore = item.score;
  });

  return sortedData;
};

const PowerRankings = () => (
  <div className="main-container">
    <div className="powerrankings-container">
      <h1 className="powerrankings-title">Power Rankings</h1>
      <Table
        columns={columns}
        dataSource={sortAndRankData(rawData)}
        pagination={false}
      />
    </div>
  </div>
);

export default PowerRankings;
