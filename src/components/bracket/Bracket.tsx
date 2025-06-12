import "./bracket.css";
import { Space, Button, Input, message, Checkbox } from "antd";
import { useState } from "react";
import { mockPlayers, Player } from "../../data/mockPlayers";

import TwoTeamBracket from "./team-count-bracket-shells/2-team-bracket/TwoTeamBracket";
import ThreeTeamBracket from "./team-count-bracket-shells/3-team-bracket/ThreeTeamBracket";
import FourTeamBracket from "./team-count-bracket-shells/4-team-bracket/FourTeamBracket";
import FiveTeamBracket from "./team-count-bracket-shells/5-team-bracket/FiveTeamBracket";
import SixTeamBracket from "./team-count-bracket-shells/6-team-bracket/SixTeamBracker";
import SevenTeamBracket from "./team-count-bracket-shells/7-team-bracket/SevenTeamBracket";
import EightTeamBracket from "./team-count-bracket-shells/8-team-bracket/EightTeamBracket";

const MAX_PLAYERS = 10;
const AUTO_SELECT_COUNT = 10;

export default function Bracket() {
  // const allPlayers = [...mockPlayers].sort((a, b) =>
  //   a.name.localeCompare(b.name)
  // );

  ////ABOVE AND BELOW ARE USED FOR QUICK DEVELOPMENT TESTING
  ////UNCOMMENT THESE. AND COMMENT OUT THEIR EQUIVALENTS BELOW
  ////TO CONTINUE TESTING

  // const [selected, setSelected] = useState<string[]>(
  //   allPlayers.slice(0, AUTO_SELECT_COUNT).map((p) => p.name)
  // );

  const [selected, setSelected] = useState<string[]>([]);
  const [teams, setTeams] = useState<[string, string][] | null>(null);

  const allPlayers = [...mockPlayers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const onCheck = (name: string, checked: boolean) => {
    if (checked) {
      if (selected.length >= MAX_PLAYERS) {
        return message.error(`Max ${MAX_PLAYERS} players`);
      }
      setSelected((p) => [...p, name]);
    } else {
      setSelected((p) => p.filter((n) => n !== name));
    }
    setTeams(null);
  };

  const shuffle = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const buildBracket = () => {
    if (selected.length < 2 || selected.length % 2 !== 0) {
      return message.error("Select an even number of players (≥2).");
    }
    const s = shuffle([...selected]);
    const pairs: [string, string][] = [];
    for (let i = 0; i < s.length; i += 2) {
      pairs.push([s[i], s[i + 1]]);
    }
    setTeams(pairs);
  };

  const addPlayer = () => {
    console.log("adding player");
    //add player to database.
    //will just add to dummy data for now.
  };

  // how many teams did we get?
  const teamCount = teams?.length ?? 0;

  return (
    <div className="bracket-scroll-wrapper">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {!teams && (
          <>
            <h3 style={{ color: "#fff" }}>Who is playing?</h3>
            <div className="player-grid">
              {allPlayers.map((player: Player) => (
                <Checkbox
                  key={player.id}
                  checked={selected.includes(player.name)}
                  disabled={
                    !selected.includes(player.name) &&
                    selected.length >= MAX_PLAYERS
                  }
                  onChange={(e) => onCheck(player.name, e.target.checked)}
                >
                  {player.name}
                </Checkbox>
              ))}
            </div>
            <Button
              type="primary"
              disabled={selected.length < 4 || selected.length % 2 !== 0}
              onClick={buildBracket}
              className="generate-bracket-button"
            >
              Generate {selected.length / 2}-Team Bracket
            </Button>
          </>
        )}

        <div className="bracket-scroll-content">
          {teams && teamCount === 2 && <TwoTeamBracket teams={teams} />}
          {teams && teamCount === 3 && <ThreeTeamBracket teams={teams} />}
          {teams && teamCount === 4 && <FourTeamBracket teams={teams} />}
          {teams && teamCount === 5 && <FiveTeamBracket teams={teams} />}
        </div>
      </Space>
    </div>
  );
}
