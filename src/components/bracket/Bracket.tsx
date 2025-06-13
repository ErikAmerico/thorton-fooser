import "./bracket.css";
import { Space, Button, message, Checkbox, Modal } from "antd";
import { useState, useEffect } from "react";
import { mockPlayers, Player } from "../../data/mockPlayers";

import TwoTeamBracket from "./team-count-bracket-shells/2-team-bracket/TwoTeamBracket";
import ThreeTeamBracket from "./team-count-bracket-shells/3-team-bracket/ThreeTeamBracket";
import FourTeamBracket from "./team-count-bracket-shells/4-team-bracket/FourTeamBracket";
import FiveTeamBracket from "./team-count-bracket-shells/5-team-bracket/FiveTeamBracket";
import SixTeamBracket from "./team-count-bracket-shells/6-team-bracket/SixTeamBracker";
import SevenTeamBracket from "./team-count-bracket-shells/7-team-bracket/SevenTeamBracket";
import EightTeamBracket from "./team-count-bracket-shells/8-team-bracket/EightTeamBracket";

const MAX_PLAYERS = 10;
const STORAGE_KEY = "bracketState"; //local stroage key
const AUTO_SELECT_COUNT = 10; //test variable

interface StoredState {
  selected: string[];
  teams: [string, string][] | null;
  matchResults?: any;
}

interface MatchResult {
  winner: string | null;
  loser: string | null;
}

export default function Bracket() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const allPlayers = [...mockPlayers].sort((a, b) =>
  //   a.name.localeCompare(b.name)
  // );

  ////ABOVE AND BELOW ARE USED FOR QUICK DEVELOPMENT TESTING
  ////UNCOMMENT THESE. AND COMMENT OUT THEIR EQUIVALENTS BELOW
  ////TO CONTINUE TESTING

  // const [selected, setSelected] = useState<string[]>(
  //   allPlayers.slice(0, AUTO_SELECT_COUNT).map((p) => p.name)
  // );

  const initialState: StoredState = {
    selected: [],
    teams: null,
    matchResults: null,
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const [bracketState, setBracketState] = useState<StoredState>(() => {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (json) return JSON.parse(json);
    } catch {}
    return initialState;
  });

  const { selected, teams, matchResults } = bracketState;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bracketState));
  }, [bracketState]);

  const allPlayers = [...mockPlayers].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const onCheck = (name: string, checked: boolean) => {
    if (checked && selected.length >= MAX_PLAYERS) {
      return message.error(`Max ${MAX_PLAYERS} players`);
    }
    const newSelected = checked
      ? [...selected, name]
      : selected.filter((n) => n !== name);

    // reset any existing bracket if players change
    setBracketState({
      selected: newSelected,
      teams: null,
      matchResults: null,
    });
  };

  //fisher-yates shuffle
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
    const s: string[] = shuffle([...selected]);
    const pairs: [string, string][] = [];
    for (let i = 0; i < s.length; i += 2) {
      pairs.push([s[i], s[i + 1]]);
    }

    // initialize one result-slot per match (we’ll use length = pairs.length*2 + 1)
    const emptyResults: MatchResult[] = Array(pairs.length * 2 + 1)
      .fill(null)
      .map(() => ({ winner: null, loser: null }));

    setBracketState({
      selected,
      teams: pairs,
      matchResults: emptyResults,
    });
  };

  const addPlayer = () => {
    console.log("adding player");
    //add player to database.
    //will just add to dummy data for now.
  };

  const deleteGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBracketState(initialState);
    setIsModalOpen(false);

    message.success("Bracket cleared. Start a new game!");
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

        {teams && (
          <div style={{ marginRight: "100%" }}>
            <Button danger onClick={showModal}>
              Cancel Game
            </Button>
          </div>
        )}

        <div className="bracket-scroll-content">
          {teams && teamCount === 2 && (
            <TwoTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
            />
          )}
          {teams && teamCount === 3 && (
            <ThreeTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
            />
          )}
          {teams && teamCount === 4 && (
            <FourTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
            />
          )}
          {teams && teamCount === 5 && (
            <FiveTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
            />
          )}
          {/* {teams && teamCount === 6 && <SixTeamBracket />} */}
          {/* {teams && teamCount === 7 && <SevenTeamBracket />} */}
          {/* {teams && teamCount === 8 && <EightTeamBracket />} */}
        </div>
      </Space>
      <Modal
        title="Are you sure?"
        open={isModalOpen}
        onOk={deleteGame}
        onCancel={handleCancel}
        closable={false}
        okText="Confirm"
        style={{ textAlign: "center" }}
      >
        Canceling this game will lose all progress. It will be like it never
        existed.
      </Modal>
    </div>
  );
}
