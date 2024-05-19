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
const data = [
  {
    key: "1",
    name: "Michelle",
    rank: 1,
    score: 12,
  },
  {
    key: "2",
    name: "Ofir",
    rank: 2,
    score: 11,
  },
  {
    key: "3",
    name: "Brittany",
    rank: 2,
    score: 11,
  },
  {
    key: "4",
    name: "Erik",
    rank: 3,
    score: 9,
  },
  {
    key: "5",
    name: "Andraya",
    rank: 4,
    score: 5,
  },
  {
    key: "6",
    name: "Anna",
    rank: 4,
    score: 5,
  },
  {
    key: "7",
    name: "Steve",
    rank: 5,
    score: 2,
  },
  {
    key: "8",
    name: "Sarah",
    rank: 5,
    score: 2,
  },
  {
    key: "0",
    name: "Zach",
    rank: 5,
    score: 2,
  },
  {
    key: "9",
    name: "Tommy",
    rank: 6,
    score: 1,
  },
  {
    key: "10",
    name: "Dan",
    rank: 6,
    score: 1,
  },
  {
    key: "11",
    name: "Rachel",
    rank: 6,
    score: 1,
  },
  {
    key: "12",
    name: "Ari",
    rank: 6,
    score: 1,
  },
];
const PowerRankings = () => (
  <Table
    columns={columns}
    dataSource={data}
    pagination={false}
    scroll={{ y: 320 }}
  />
);
export default PowerRankings;
