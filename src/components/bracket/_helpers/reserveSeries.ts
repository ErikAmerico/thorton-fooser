import { MatchResult, Team } from "../../../types";
import { isSameTeam } from "./isSameTeam";

// The 7-player bracket has two matches that are really SERIES: they are played
// repeatedly until one side has accumulated 2 losses across the whole
// tournament. Each game of a series is stored as its own MatchResult so that
// calculateScores, the history replay and the AI summary all keep working
// without changes - every game credits +1 / -0.25 exactly like a normal match.
//
// Slot layout for the 7-player bracket (index 0 is unused, as everywhere):
//   1        Match 1  - winners round 1
//   2        Match 2  - semifinal
//   3        Match 3  - losers round 1 (elimination + donor)
//   4,5,6    Match 4  - losers final series (up to 3 games)
//   7,8,9,10 Match 5  - grand final series (up to 4 games)
export const LOSERS_FINAL_SLOTS = [4, 5, 6];
export const GRAND_FINAL_SLOTS = [7, 8, 9, 10];
export const RESERVE_RESULT_SLOTS = 11;

/**
 * Losses a team has accumulated, optionally ignoring everything after a given
 * slot.
 *
 * A series must be judged only on what had happened by the time it was played.
 * Counting later rounds too means that once the losers-final winner picks up
 * their second loss in the grand final, re-resolving the losers final flips its
 * answer to the team that actually lost it - so reopening a grand-final game
 * offers an opponent who is already out.
 */
export function lossesFor(
  team: Team,
  matchResults: MatchResult[],
  upToSlot?: number
): number {
  return matchResults.reduce((total, match, slot) => {
    if (upToSlot != null && slot > upToSlot) return total;
    return match.loser && isSameTeam(match.loser, team) ? total + 1 : total;
  }, 0);
}

/** The games of a series that have been played, in order. */
export function playedGames(
  slots: number[],
  matchResults: MatchResult[]
): MatchResult[] {
  return slots
    .map((slot) => matchResults[slot])
    .filter((match): match is MatchResult => Boolean(match?.winner));
}

/** The next empty slot in a series, or null when every slot is used. */
export function nextOpenSlot(
  slots: number[],
  matchResults: MatchResult[]
): number | null {
  return slots.find((slot) => !matchResults[slot]?.winner) ?? null;
}

export interface SeriesState {
  /** Games played in this series so far. */
  games: MatchResult[];
  /** Result slot the next game writes to, or null if the series is decided. */
  nextSlot: number | null;
  /** Slot of the most recent game, so a decided series stays correctable. */
  lastPlayedSlot: number | null;
  /** Set once a team has reached 2 total losses. */
  winner: Team | null;
  eliminated: Team | null;
}

/**
 * Champion of the 7-player reserve bracket, or null if it is still running.
 * Mirrors the wiring in FourTeamBracket: the losers final feeds the grand
 * final, and each is a series decided by 2 tournament-wide losses.
 */
export function reserveChampion(
  matchResults: MatchResult[],
  reserveTeam: Team | undefined
): Team | null {
  if (!reserveTeam || reserveTeam.length < 2) return null;

  const lfEntrants = matchResults[3]?.winner
    ? { A: matchResults[3].winner, B: reserveTeam }
    : null;
  const losersFinal = resolveSeries(lfEntrants, LOSERS_FINAL_SLOTS, matchResults);
  if (!losersFinal.winner) return null;

  const gfEntrants = matchResults[2]?.winner
    ? { A: matchResults[2].winner, B: losersFinal.winner }
    : null;
  return resolveSeries(gfEntrants, GRAND_FINAL_SLOTS, matchResults).winner;
}

/** Slot holding the most recently played game of a series. */
function lastPlayedSlot(
  slots: number[],
  matchResults: MatchResult[]
): number | null {
  const played = slots.filter((slot) => matchResults[slot]?.winner);
  return played.length ? played[played.length - 1] : null;
}

/**
 * Resolve a series between two teams. `entrants` may be null while the bracket
 * is still waiting on a feeder match. Losses are counted tournament-wide up to
 * this series' own last slot, so a team arriving with one loss only needs to be
 * beaten once more - but a later round cannot rewrite who won this one.
 */
export function resolveSeries(
  entrants: { A: Team; B: Team } | null,
  slots: number[],
  matchResults: MatchResult[]
): SeriesState {
  const games = playedGames(slots, matchResults);
  const last = lastPlayedSlot(slots, matchResults);

  if (!entrants) {
    return {
      games,
      nextSlot: null,
      lastPlayedSlot: last,
      winner: null,
      eliminated: null,
    };
  }

  // Judge the series only on results up to its own last slot. Anything later
  // belongs to a subsequent round and must not retroactively change who won
  // this one - see lossesFor.
  const upTo = slots[slots.length - 1];
  const lossesA = lossesFor(entrants.A, matchResults, upTo);
  const lossesB = lossesFor(entrants.B, matchResults, upTo);

  if (lossesA >= 2 || lossesB >= 2) {
    const eliminated = lossesA >= 2 ? entrants.A : entrants.B;
    const winner = lossesA >= 2 ? entrants.B : entrants.A;
    return { games, nextSlot: null, lastPlayedSlot: last, winner, eliminated };
  }

  return {
    games,
    nextSlot: nextOpenSlot(slots, matchResults),
    lastPlayedSlot: last,
    winner: null,
    eliminated: null,
  };
}
