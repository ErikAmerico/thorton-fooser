import "./bracket.css";
import { Space, message } from "antd";
import { useState, useEffect } from "react";
import CancelGameModal from "./_components/CancelGameModal";
import SubmitResultsModal from "./_components/SubmitResultsModal";
import InfoModal from "./_components/info-modal/InfoModal";
import PlayerPicker from "./_components/player-picker/PlayerPicker";
import { RenderBracket } from "./_components/BracketRenderer";
import BracketControls from "./_components/bracket-controls/BracketControls";
import SummaryModal from "./_components/summary-modal/SummaryModal";
import { shufflePlayerFromDB } from "./_helpers/shufflePlayerFromDB";
import { useLocalStorageBracketState } from "./_helpers/useLocalStorageBracketState";
import { MatchResult, PlayerFromDB, Team, OutletContext } from "../../types";
import { MAX_PLAYERS, STORAGE_KEY, initialState } from "../../data/constants";
import { calculateScores } from "./_helpers/calculateScores";
import { batchUpdateScoresAndSendTournamentData } from "../../api/matches";
import { fetchAISummary } from "../../api/summary";
import { useOutletContext } from "react-router-dom";

export default function Bracket() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
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
  const { players, reloadPlayers, reloadTournamentHistory } =
    useOutletContext<OutletContext>();
  const [summaryText, setSummaryText] = useState("");
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  useEffect(() => {
    // console.log(isTourneyFinished);
    localStorage.setItem("tourneyFinished", JSON.stringify(isTourneyFinished));
  }, [isTourneyFinished]);

  useEffect(() => {
    const storedSummary = localStorage.getItem("tourneySummary");
    if (storedSummary) setSummaryText(storedSummary);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hasSubmittedResults",
      JSON.stringify(hasSubmittedResults)
    );
  }, [hasSubmittedResults]);

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

  const allPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

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
    localStorage.removeItem("tourneySummary");
    setSummaryText("");
    if (selected.length < 2 || selected.length % 2 !== 0) {
      return message.error("Select an even number of players (≥2).");
    }
    const plyrs: PlayerFromDB[] = shufflePlayerFromDB([...selected]);
    // //used to control building teams - for testing
    // const plyrs: PlayerFromDB[] = selected;

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
    if (!teams || !matchResults) {
      //avoiding typescript null error. This will never be null.
      return message.error("Cannot submit: no bracket has been generated yet");
    }

    const finalScores = calculateScores(matchResults, isTourneyFinished);
    try {
      await batchUpdateScoresAndSendTournamentData(
        finalScores,
        teams,
        matchResults,
        secretCode
      );

      message.success("Results saved!");
      setIsSubmitModalOpen(false);
      //So we can't submit the results repeatedly
      setHasSubmittedResults(true);
      reloadPlayers();
      reloadTournamentHistory();
      setIsSummaryModalOpen(true);
      const summary = await fetchAISummary(matchResults);
      setSummaryText(summary);
      localStorage.setItem("tourneySummary", summary);
      console.log("AI Summary:", summary);
    } catch (error: any) {
      message.error("Failed to submit: " + error.message);
    }
  };

  const generateNewSummary = async () => {
    if (!matchResults) {
      return message.error("No match results available to summarize.");
    }

    setSummaryText("");
    setIsSummaryModalOpen(true);

    try {
      const summary = await fetchAISummary(matchResults);
      setSummaryText(summary);
      localStorage.setItem("tourneySummary", summary);
      console.log("New AI Summary:", summary);
    } catch (error: any) {
      message.error("Failed to generate summary: " + error.message);
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
            hasSubmittedResults={hasSubmittedResults}
            setIsSummaryModalOpen={setIsSummaryModalOpen}
            onGenerateNewReport={generateNewSummary}
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
              fireConfetti: true,
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
      <SummaryModal
        open={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summary={summaryText}
      />
    </div>
  );
}
