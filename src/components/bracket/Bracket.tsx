import "./bracket.css";
import { Space, message } from "antd";
import { useState, useEffect } from "react";
import CancelGameModal from "./_components/CancelGameModal";
import EndGameModal from "./_components/EndGameModal";
import SubmitResultsModal from "./_components/SubmitResultsModal";
import InfoModal from "./_components/info-modal/InfoModal";
import PlayerPicker from "./_components/player-picker/PlayerPicker";
import { RenderBracket } from "./_components/BracketRenderer";
import BracketControls from "./_components/bracket-controls/BracketControls";
import SummaryModal from "./_components/summary-modal/SummaryModal";
import DonorSelectModal from "./_components/donor-select-modal/DonorSelectModal";
import ChampionBanner from "./_components/champion-banner/ChampionBanner";
import { getChampion } from "./_helpers/getChampion";
import { isSameTeam } from "./_helpers/isSameTeam";
import { shufflePlayerFromDB } from "./_helpers/shufflePlayerFromDB";
import { RESERVE_CONFIG } from "./_helpers/reserveConfig";
import { useTeamReveal } from "./_helpers/useTeamReveal";
import {
  RESERVE_RESULT_SLOTS,
  reserveChampion,
} from "./_helpers/reserveSeries";
import { useLocalStorageBracketState } from "./_helpers/useLocalStorageBracketState";
import { MatchResult, PlayerFromDB, Team, OutletContext } from "../../types";
import { MAX_PLAYERS, STORAGE_KEY, initialState } from "../../data/constants";
import { calculateScores } from "./_helpers/calculateScores";
import { batchUpdateScoresAndSendTournamentData } from "../../api/matches";
import { fetchAISummary } from "../../api/summary";
import { useOutletContext } from "react-router-dom";

export default function Bracket() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
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
  // set when the user generates a bracket, so the reveal animation runs then
  // and not on every reload of a bracket restored from localStorage
  const [justGenerated, setJustGenerated] = useState(false);

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
    setIsEndGameModalOpen(false);
    setIsSubmitModalOpen(false);
    setIsInfoModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showEndGameModal = () => {
    setIsEndGameModalOpen(true);
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
    const isOdd = selected.length % 2 === 1;
    const newTeamCount = Math.ceil(selected.length / 2);
    if (selected.length < 4 || (isOdd && !RESERVE_CONFIG[newTeamCount])) {
      return message.error(
        isOdd
          ? "Odd player counts need at least 7 players for a reserve bracket."
          : "Select at least 4 players."
      );
    }
    const plyrs: PlayerFromDB[] = shufflePlayerFromDB([...selected]);
    // //used to control building teams - for testing
    // const plyrs: PlayerFromDB[] = selected;

    // odd count - the last shuffled player becomes the solo reserve team
    const reservePlayer = isOdd ? plyrs.pop()! : null;

    const pairs: Team[] = [];
    for (let i = 0; i < plyrs.length; i += 2) {
      pairs.push([plyrs[i], plyrs[i + 1]]);
    }
    if (reservePlayer) {
      pairs.splice(RESERVE_CONFIG[newTeamCount].seat, 0, [reservePlayer]);
    }

    // initialize one result-slot per match - skipping index 0. The 7-player
    // bracket needs extra slots because its two finals are series (each game
    // is stored separately) - see reserveSeries.ts
    const slotCount =
      isOdd && newTeamCount === 4
        ? RESERVE_RESULT_SLOTS
        : pairs.length * 2 + 1;
    const emptyResults: MatchResult[] = Array(slotCount)
      .fill(null)
      .map(() => ({ winner: null, loser: null }));

    // only a freshly generated bracket plays the slot-machine reveal - a
    // reload restored from localStorage should show the teams immediately
    setJustGenerated(true);
    setBracketState({
      selected,
      teams: pairs,
      matchResults: emptyResults,
    });
  };

  const cancelGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBracketState(initialState);
    setJustGenerated(false);
    setIsModalOpen(false);
  };

  const endGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("tourneySummary");
    setBracketState(initialState);
    setJustGenerated(false);
    setIsTourneyFinished(false);
    setHasSubmittedResults(false);
    setSummaryText("");
    setIsEndGameModalOpen(false);
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

  // slot-machine reveal of the shuffled teams, one player at a time
  const { teams: displayTeams, isRevealing } = useTeamReveal(
    teams,
    selected,
    justGenerated
  );

  // reserve-team support for odd player counts (see reserveConfig.ts)
  const reserveCfg =
    selected.length % 2 === 1 ? RESERVE_CONFIG[teamCount] : undefined;
  const reserveTeam = reserveCfg && teams ? teams[reserveCfg.seat] : null;
  const eliminatedTeam =
    reserveCfg && matchResults
      ? matchResults[reserveCfg.feederMatch]?.loser ?? null
      : null;
  // A correction to the feeder match can un-eliminate the team that donated,
  // which would leave the donor on the reserve team AND on their original team
  // - one player on two live teams. Detect that and send them back.
  const donorIsStale = Boolean(
    reserveTeam &&
      reserveTeam.length === 2 &&
      eliminatedTeam &&
      !eliminatedTeam.some((p) => p.id === reserveTeam[1].id)
  );

  useEffect(() => {
    if (!donorIsStale || !teams || !reserveCfg || !matchResults) return;
    const staleReserve = teams[reserveCfg.seat];
    const newTeams = teams.map((team, i) =>
      i === reserveCfg.seat ? [team[0]] : team
    );
    // Any match the reserve already played was recorded with the old pairing.
    // Leaving those results would keep advancing a team that no longer exists
    // and could put the returned donor on both sides of a later match, so drop
    // every result the stale reserve team appears in.
    const newResults = matchResults.map((m) =>
      (m.winner && isSameTeam(m.winner, staleReserve)) ||
      (m.loser && isSameTeam(m.loser, staleReserve))
        ? { winner: null, loser: null }
        : m
    );
    setBracketState({
      ...bracketState,
      teams: newTeams,
      matchResults: newResults,
    });
    message.info("That team is back in - pick a new player for the reserve.");
    // bracketState is the object we are replacing; including it would loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donorIsStale]);

  // feeder match decided but the reserve team is still solo - pick a donor
  const donorNeeded = Boolean(
    reserveTeam && reserveTeam.length === 1 && eliminatedTeam
  );

  const assignDonor = (donor: PlayerFromDB) => {
    if (!teams || !reserveCfg || !reserveTeam) return;
    // The donor just joins the reserve team - nothing is reshuffled and the
    // slot-machine reveal must not replay, so close the reveal window first.
    setJustGenerated(false);
    const newTeams = teams.map((team, i) =>
      i === reserveCfg.seat ? [...team, donor] : team
    );
    setBracketState({ ...bracketState, teams: newTeams });
    message.success(
      `${donor.name} joins ${reserveTeam[0].name} on the reserve team!`
    );
  };

  return (
    <div className="bracket-scroll-wrapper">
      {teams && (
        <ChampionBanner
          champion={getChampion(
            matchResults,
            teamCount,
            // only the 7-player bracket resolves its champion from a series;
            // every other reserve count uses the standard CHAMPION_SLOTS path
            reserveCfg && matchResults && teamCount === 4
              ? reserveChampion(matchResults, teams[reserveCfg.seat])
              : undefined
          )}
        />
      )}
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
            onEndGame={showEndGameModal}
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
              teams: displayTeams ?? teams,
              matchResults: matchResults!,
              onChange: (newResults) =>
                setBracketState({ ...bracketState, matchResults: newResults }),
              setIsTourneyFinished,
              fireConfetti: true,
              reserveMode: Boolean(reserveCfg),
              hasSubmittedResults,
              isRevealing,
            })}
        </div>
      </Space>
      <CancelGameModal
        open={isModalOpen}
        onOk={cancelGame}
        onCancel={handleCancel}
      />
      <EndGameModal
        open={isEndGameModalOpen}
        onOk={endGame}
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
      <DonorSelectModal
        open={donorNeeded}
        reservePlayer={reserveTeam?.[0] ?? null}
        eliminatedTeam={eliminatedTeam}
        onConfirm={assignDonor}
      />
    </div>
  );
}
