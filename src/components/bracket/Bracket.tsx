import "./bracket.css";
import { Space, message } from "antd";
import { useState, useEffect } from "react";
import CancelGameModal from "./_components/CancelGameModal";
import SubmitResultsModal from "./_components/SubmitResultsModal";
import InfoModal from "./_components/InfoModal";
import PlayerPicker from "./_components/PlayerPicker";
import { RenderBracket } from "./_components/BracketRenderer";
import BracketControls from "./_components/BracketControls";
import { shufflePlayerFromDB } from "./_helpers/shufflePlayerFromDB";
import { useLocalStorageBracketState } from "./_helpers/useLocalStorageBracketState";
import { MatchResult, PlayerFromDB, Team, StoredState } from "../../types";
import { mockPlayers } from "../../data/mockData";

const MAX_PLAYERS = 14;
const STORAGE_KEY = "bracketState"; //will eventually be in .env file

const initialState: StoredState = {
  selected: [],
  teams: null,
  matchResults: null,
};

export default function Bracket() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  // const [players, setPlayers] = useState<PlayerFromDB[]>([]);
  const [bracketState, setBracketState] = useLocalStorageBracketState();
  const [isTourneyFinished, setIsTourneyFinished] = useState(false);
  const { selected, teams, matchResults } = bracketState;
  const API = "http://localhost:3000"; //eventually go to .env

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

  // const allPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name)); //getting player from api

  const allPlayers = [...mockPlayers].sort((a, b) =>
    a.name.localeCompare(b.name)
  ); //getting players from mockData

  const onCheck = (player: PlayerFromDB, checked: boolean) => {
    if (checked && selected.length >= MAX_PLAYERS) {
      return message.error(`Max ${MAX_PLAYERS} players`);
    }
    const newSelected = checked
      ? [...selected, player]
      : selected.filter((plyr) => plyr.id !== player.id);

    // reset any existing bracket if players change
    setBracketState({
      selected: newSelected,
      teams: null,
      matchResults: null,
    });
  };

  console.log(bracketState);

  const buildBracket = () => {
    if (selected.length < 2 || selected.length % 2 !== 0) {
      return message.error("Select an even number of players (≥2).");
    }
    const plyrs: PlayerFromDB[] = shufflePlayerFromDB([...selected]);
    const pairs: Team[] = [];
    for (let i = 0; i < plyrs.length; i += 2) {
      pairs.push([plyrs[i], plyrs[i + 1]]);
    }

    // initialize one result-slot per match - skipping index 0.
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
          <PlayerPicker
            players={allPlayers}
            selected={selected}
            maxPlayers={MAX_PLAYERS}
            onToggle={onCheck}
            onGenerate={buildBracket}
          />
        )}

        {teams && (
          <BracketControls
            onCancelGame={showModal}
            onSubmitResults={showSubmitModal}
            onShowInfo={showInfoModal}
          />
        )}

        <div className="bracket-scroll-content">
          {teams &&
            RenderBracket(teamCount, {
              teams,
              matchResults: matchResults!,
              onChange: (newResults) =>
                setBracketState({ ...bracketState, matchResults: newResults }),
              setIsTourneyFinished,
            })}
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
