import "./bracket.css";
import { Space, Button, message, Checkbox } from "antd";
import { useState, useEffect } from "react";
import TwoTeamBracket from "./team-count-brackets/2-team-bracket/TwoTeamBracket";
import ThreeTeamBracket from "./team-count-brackets/3-team-bracket/ThreeTeamBracket";
import FourTeamBracket from "./team-count-brackets/4-team-bracket/FourTeamBracket";
import FiveTeamBracket from "./team-count-brackets/5-team-bracket/FiveTeamBracket";
import SixTeamBracket from "./team-count-brackets/6-team-bracket/SixTeamBracker";
import SevenTeamBracket from "./team-count-brackets/7-team-bracket/SevenTeamBracket";
import EightTeamBracket from "./team-count-brackets/8-team-bracket/EightTeamBracket";
import { InfoCircleOutlined } from "@ant-design/icons";
import { MatchResult, PlayerFromDB, Team, StoredState } from "../../types";
import { mockPlayers } from "../../data/mockData";
import CancelGameModal from "./_components/CancelGameModal";
import SubmitResultsModal from "./_components/SubmitResultsModal";
import InfoModal from "./_components/InfoModal";
import { shufflePlayerFromDB } from "./_helpers/shufflePlayerFromDB";

const MAX_PLAYERS = 14;
const STORAGE_KEY = "bracketState"; //local stroage key

const initialState = {
  selected: [],
  teams: null,
  matchResults: null,
};

export default function Bracket() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  // const [players, setPlayers] = useState<PlayerFromDB[]>([]);
  const [bracketState, setBracketState] = useState<StoredState>(() => {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (json) return JSON.parse(json);
    } catch {}
    return initialState;
  });
  const [isTourneyFinished, setIsTourneyFinished] = useState(false);
  const { selected, teams, matchResults } = bracketState;
  const API = "http://localhost:3000";

  useEffect(() => {
    console.log("tournament over?", isTourneyFinished);
    if (isTourneyFinished) {
      console.log("calculate results!");
    }
  }, [isTourneyFinished]);

  // useEffect(() => {
  //   fetch(`${API}/players`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       // console.log("fetched players", data);
  //       setPlayers(data);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to load players:", err);
  //       message.error("Couldn't load players");
  //     });
  // }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsSubmitModalOpen(false);
    setIsInfoModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showSubmitModal = () => {
    setIsSubmitModalOpen(true);
  };

  const showInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bracketState));
  }, [bracketState]);

  // const allPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name)); //getting player from api

  const allPlayers = [...mockPlayers].sort((a, b) =>
    a.name.localeCompare(b.name)
  ); //getting players from mockData

  console.log(allPlayers);

  const onCheck = (player: PlayerFromDB, checked: boolean) => {
    if (checked && selected.length >= MAX_PLAYERS) {
      return message.error(`Max ${MAX_PLAYERS} players`);
    }
    const newSelected = checked
      ? [...selected, player]
      : selected.filter((plyr) => plyr.id !== player.id);

    // console.log(newSelected);

    // reset any existing bracket if players change
    setBracketState({
      selected: newSelected,
      teams: null,
      matchResults: null,
    });
  };

  const buildBracket = () => {
    if (selected.length < 2 || selected.length % 2 !== 0) {
      return message.error("Select an even number of players (≥2).");
    }
    const plyrs: PlayerFromDB[] = shufflePlayerFromDB([...selected]);
    const pairs: Team[] = [];
    for (let i = 0; i < plyrs.length; i += 2) {
      pairs.push([plyrs[i], plyrs[i + 1]]);
    }

    // initialize one result-slot per match
    const emptyResults: MatchResult[] = Array(pairs.length * 2 + 1)
      .fill(null)
      .map(() => ({ winner: null, loser: null }));

    setBracketState({
      selected,
      teams: pairs,
      matchResults: emptyResults,
    });
  };

  // const addPlayer = () => {
  //   // console.log("adding player");
  //   //add player to database.
  //   //will just add to dummy data for now.
  // };

  const cancelGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBracketState(initialState);
    setIsModalOpen(false);
  };

  const submitResults = () => {
    // console.log("results submitted");
    setIsSubmitModalOpen(false);
  };

  // how many teams did we get?
  const teamCount = teams?.length ?? 0;

  return (
    <div className="bracket-scroll-wrapper">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {!teams && (
          <>
            <h3 style={{ color: "#fff", fontFamily: "sans-serif" }}>
              Who is playing?
            </h3>
            <div className="player-grid">
              {allPlayers.map((player: PlayerFromDB) => (
                <Checkbox
                  key={player.id}
                  checked={bracketState.selected.some(
                    (p) => p.id === player.id
                  )}
                  disabled={
                    !bracketState.selected.some((p) => p.id === player.id) &&
                    bracketState.selected.length >= MAX_PLAYERS
                  }
                  onChange={(e) => onCheck(player, e.target.checked)}
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
          <div>
            <div className="bracket-controls">
              <Button className="cancel-tourney-btn" onClick={showModal}>
                Cancel Game
              </Button>

              <Button className="submit-results-btn" onClick={showSubmitModal}>
                Submit Results
              </Button>

              <InfoCircleOutlined
                onClick={showInfoModal}
                className="infoCircle"
                style={{ color: "white" }}
              />
            </div>
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
              setIsTourneyFinished={setIsTourneyFinished}
            />
          )}
          {teams && teamCount === 3 && (
            <ThreeTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
              setIsTourneyFinished={setIsTourneyFinished}
            />
          )}
          {teams && teamCount === 4 && (
            <FourTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
              setIsTourneyFinished={setIsTourneyFinished}
            />
          )}
          {teams && teamCount === 5 && (
            <FiveTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
              setIsTourneyFinished={setIsTourneyFinished}
            />
          )}
          {teams && teamCount === 6 && (
            <SixTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
              setIsTourneyFinished={setIsTourneyFinished}
            />
          )}
          {teams && teamCount === 7 && (
            <SevenTeamBracket
              teams={teams}
              matchResults={matchResults!}
              onChange={(newResults) =>
                setBracketState((st) => ({ ...st, matchResults: newResults }))
              }
              setIsTourneyFinished={setIsTourneyFinished}
            />
          )}
          {/* {teams && teamCount === 8 && <EightTeamBracket />} */}
        </div>
      </Space>
      <CancelGameModal
        open={isModalOpen}
        onOk={cancelGame}
        onCancel={handleCancel}
      />
      <SubmitResultsModal
        open={isSubmitModalOpen}
        onOk={submitResults}
        onCancel={handleCancel}
      />
      <InfoModal open={isInfoModalOpen} onOk={handleCancel} />
    </div>
  );
}
