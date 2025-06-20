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
import { MatchResult, PlayerFromDB, Team } from "../../types";
import { MAX_PLAYERS, STORAGE_KEY, initialState } from "../../data/constants";
import { calculateScores } from "./_helpers/calculateScores";
import { batchUpdateScores } from "../../api/matches";
import { fetchPlayers } from "../../api/players";
import { mockPlayers } from "../../data/mockData";

export default function Bracket() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [players, setPlayers] = useState<PlayerFromDB[]>([]);
  const [bracketState, setBracketState] = useLocalStorageBracketState();
  const { selected, teams, matchResults } = bracketState;
  const [isTourneyFinished, setIsTourneyFinished] = useState<boolean>(() => {
    const stored = localStorage.getItem("tourneyFinished");
    return stored ? JSON.parse(stored) : false;
  });
  const [hasSubmittedResults, setHasSubmittedResults] = useState<boolean>(
    () => {
      const s = localStorage.getItem("hasSubmittedResults");
      return s ? JSON.parse(s) : false;
    }
  );

  useEffect(() => {
    console.log(isTourneyFinished);
    localStorage.setItem("tourneyFinished", JSON.stringify(isTourneyFinished));
  }, [isTourneyFinished]);

  useEffect(() => {
    localStorage.setItem(
      "hasSubmittedResults",
      JSON.stringify(hasSubmittedResults)
    );
  }, [hasSubmittedResults]);

  useEffect(() => {
    fetchPlayers()
      .then((data) => {
        // console.log("fetched players", data);
        setPlayers(data);
      })
      .catch((err) => {
        console.error("Failed to load players", err);
        message.error("Couldn't load players");
      });
  }, []);

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

  const allPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name)); //getting player from api

  // const allPlayers = [...mockPlayers].sort((a, b) =>
  //   a.name.localeCompare(b.name)
  // ); //getting players from mockData

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

  const buildBracket = () => {
    setIsTourneyFinished(false);
    setHasSubmittedResults(false);
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

  const cancelGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBracketState(initialState);
    setIsModalOpen(false);
  };

  const submitResults = async (secretCode: string) => {
    const finalScores = calculateScores(matchResults, isTourneyFinished);
    try {
      await batchUpdateScores(finalScores, secretCode);

      message.success("Results saved!");
      setIsSubmitModalOpen(false);
      //So we can't submit the results repeatedly
      setHasSubmittedResults(true);
    } catch (error: any) {
      message.error("Failed to submit: " + error.message);
    }
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
            isTourneyFinished={isTourneyFinished && !hasSubmittedResults}
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
