import { Table } from "antd";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
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

const rawData = [
  { key: "michelles", name: "Michelle", score: 14 },
  { key: "ofir", name: "Ofir", score: 18 },
  { key: "brickwall", name: "Brittany", score: 14 },
  { key: "erik", name: "Erik", score: 16 },
  { key: "dray", name: "Andraya", score: 11.5 },
  { key: "anna", name: "Anna", score: 8 },
  { key: "mattsarissa", name: "Matt", score: 6.5 },
  { key: "stevem", name: "Steve", score: 2 },
  { key: "sarah", name: "Sarah", score: 2 },
  { key: "zachsm", name: "Zach Smith", score: 2 },
  { key: "tommyb", name: "Tommy", score: 1 },
  { key: "danrachel", name: "Dan", score: 1 },
  { key: "rachelj", name: "Rachel Jobe", score: 1 },
  { key: "ari", name: "Ari", score: 2 },
  { key: "andyp", name: "Andy P", score: 2 },
  { key: "karach", name: "Kara", score: 1 },
  { key: "cj", name: "CJ", score: 1 },
  { key: "kelly", name: "Kelly", score: 1 },
  { key: "sarissa", name: "Sarissa", score: 1 },
  { key: "lindsay", name: "Lindsay", score: 1 },
  { key: "BryanCJ", name: "Bryan", score: 3 },
  { key: "jakeRos", name: "Jake R", score: 3 },
  { key: "mattdalton", name: "Matt D", score: 3 },
  { key: "casey", name: "Casey", score: 3 },
];

const sortAndRankData = (data) => {
  const sortedData = data.sort((a, b) => b.score - a.score);
  let rank = 0;
  let prevScore = null;
  sortedData.forEach((item, index) => {
    if (item.score !== prevScore) {
      rank = index + 1;
    }
    item.rank = rank;
    prevScore = item.score;
  });
  return sortedData;
};

const PowerRankings = () => (
  <Table
    columns={columns}
    dataSource={sortAndRankData(rawData)}
    pagination={false}
    scroll={{ y: 320 }}
  />
);

export default PowerRankings;
