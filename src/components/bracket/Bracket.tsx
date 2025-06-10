import "./bracket.css";
import { Select, Space } from "antd";
import { useState } from "react";

import TwoTeamBracket from "./team-count-bracket-shells/2-team-bracket/TwoTeamBracket";
import ThreeTeamBracket from "./team-count-bracket-shells/3-team-bracket/ThreeTeamBracket";
import FourTeamBracket from "./team-count-bracket-shells/4-team-bracket/FourTeamBracket";
import FiveTeamBracket from "./team-count-bracket-shells/5-team-bracket/FiveTeamBracket";
import SixTeamBracket from "./team-count-bracket-shells/6-team-bracket/SixTeamBracker";
import SevenTeamBracket from "./team-count-bracket-shells/7-team-bracket/SevenTeamBracket";
import EightTeamBracket from "./team-count-bracket-shells/8-team-bracket/EightTeamBracket";

const { Option } = Select;

export default function Bracket() {
  const [teamCount, setTeamCount] = useState<number>(6);

  const handleChange = (value: number) => {
    console.log(`selected ${value}-team bracket`);
    setTeamCount(value);
  };

  return (
    <div className="bracket-scroll-wrapper">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Select<number>
          defaultValue={6}
          style={{ width: 160 }}
          onChange={handleChange}
        >
          <Option value={2}>2-Team Bracket</Option>
          <Option value={3}>3-Team Bracket</Option>
          <Option value={4}>4-Team Bracket</Option>
          <Option value={5}>5-Team Bracket</Option>
          <Option value={6}>6-Team Bracket</Option>
          <Option value={7}>7-Team Bracket</Option>
          <Option value={8}>8-Team Bracket</Option>
        </Select>

        <div className="bracket-scroll-content">
          {teamCount === 2 && <TwoTeamBracket />}
          {teamCount === 3 && <ThreeTeamBracket />}
          {teamCount === 4 && <FourTeamBracket />}
          {teamCount === 5 && <FiveTeamBracket />}
          {teamCount === 6 && <SixTeamBracket />}
          {teamCount === 7 && <SevenTeamBracket />}
          {teamCount === 8 && <EightTeamBracket />}
        </div>
      </Space>
    </div>
  );
}
