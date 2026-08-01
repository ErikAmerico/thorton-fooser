import { MatchResult, Team } from "../../../types";
import { isSameTeam } from "./isSameTeam";

/**
 * Who feeds each match, per bracket.
 *
 * ["T", n] is team n's seed, ["W", n] the winner of match n, ["L", n] its
 * loser. These mirror the switch in each bracket's showModal exactly - they
 * were extracted from that source, not written by hand.
 *
 * The 7-player reserve bracket is deliberately absent: its finals are series
 * spread across several result slots, so "the match that feeds slot N" is not
 * a fixed pair. Corrections there are guarded by the series resolver instead.
 */
type Feed = ["T" | "W" | "L", number];

export const MATCH_GRAPH: Record<number, Record<number, [Feed, Feed]>> = {
  2: { 1: [["T", 1], ["T", 2]], 2: [["W", 1], ["L", 1]], 3: [["W", 2], ["L", 2]] },
  3: {
    1: [["T", 2], ["T", 3]], 2: [["W", 1], ["T", 1]], 3: [["L", 2], ["L", 1]],
    4: [["W", 2], ["W", 3]], 5: [["W", 4], ["L", 4]],
  },
  4: {
    1: [["T", 1], ["T", 4]], 2: [["T", 2], ["T", 3]], 3: [["L", 1], ["L", 2]],
    4: [["W", 1], ["W", 2]], 5: [["L", 4], ["W", 3]], 6: [["W", 4], ["W", 5]],
    7: [["W", 6], ["L", 6]],
  },
  5: {
    1: [["T", 4], ["T", 5]], 2: [["T", 2], ["T", 3]], 3: [["T", 1], ["W", 1]],
    4: [["L", 2], ["L", 1]], 5: [["L", 3], ["W", 4]], 6: [["W", 3], ["W", 2]],
    7: [["L", 6], ["W", 5]], 8: [["W", 6], ["W", 7]], 9: [["W", 8], ["L", 8]],
  },
  6: {
    1: [["T", 4], ["T", 5]], 2: [["T", 3], ["T", 6]], 3: [["T", 1], ["W", 1]],
    4: [["T", 2], ["W", 2]], 5: [["L", 3], ["L", 2]], 6: [["L", 4], ["L", 1]],
    7: [["W", 6], ["W", 5]], 8: [["W", 3], ["W", 4]], 9: [["L", 8], ["W", 7]],
    10: [["W", 8], ["W", 9]], 11: [["W", 10], ["L", 10]],
  },
  7: {
    1: [["T", 4], ["T", 5]], 2: [["T", 2], ["T", 7]], 3: [["T", 3], ["T", 6]],
    4: [["L", 2], ["L", 3]], 5: [["T", 1], ["W", 1]], 6: [["W", 2], ["W", 3]],
    7: [["L", 5], ["W", 4]], 8: [["L", 6], ["L", 1]], 9: [["W", 8], ["W", 7]],
    10: [["W", 5], ["W", 6]], 11: [["L", 10], ["W", 9]], 12: [["W", 10], ["W", 11]],
    13: [["W", 12], ["L", 12]],
  },
  8: {
    1: [["T", 1], ["T", 8]], 2: [["T", 4], ["T", 5]], 3: [["T", 2], ["T", 7]],
    4: [["T", 3], ["T", 6]], 5: [["L", 1], ["L", 2]], 6: [["L", 3], ["L", 4]],
    7: [["W", 1], ["W", 2]], 8: [["W", 3], ["W", 4]], 9: [["L", 7], ["W", 6]],
    10: [["L", 8], ["W", 5]], 11: [["W", 10], ["W", 9]], 12: [["W", 7], ["W", 8]],
    13: [["L", 12], ["W", 11]], 14: [["W", 12], ["W", 13]], 15: [["W", 14], ["L", 14]],
  },
  9: {
    1: [["T", 8], ["T", 9]], 2: [["T", 4], ["T", 5]], 3: [["T", 2], ["T", 7]],
    4: [["T", 3], ["T", 6]], 5: [["T", 1], ["W", 1]], 6: [["L", 1], ["L", 4]],
    7: [["L", 2], ["L", 5]], 8: [["L", 3], ["W", 6]], 9: [["W", 3], ["W", 4]],
    10: [["W", 5], ["W", 2]], 11: [["L", 9], ["W", 7]], 12: [["L", 10], ["W", 8]],
    13: [["W", 12], ["W", 11]], 14: [["W", 10], ["W", 9]], 15: [["L", 14], ["W", 13]],
    16: [["W", 14], ["W", 15]], 17: [["W", 16], ["L", 16]],
  },
};

/** The team a feed points at right now, or null if that result is missing. */
function resolveFeed(
  feed: Feed,
  teams: Team[],
  matchResults: MatchResult[]
): Team | null {
  const [kind, n] = feed;
  if (kind === "T") return teams[n - 1] ?? null;
  const match = matchResults[n];
  return (kind === "W" ? match?.winner : match?.loser) ?? null;
}

/**
 * Matches whose stored result no longer matches who actually feeds them.
 *
 * Correcting a match rewrites one slot; every later match that was fed by it
 * keeps its old teams. Those results describe games that could not have
 * happened, and they still score points - so before a correction is allowed,
 * the caller checks whether anything downstream would be invalidated.
 *
 * The reset final is excluded: confirmWinner already drops it when a
 * correction removes the need for one.
 */
export function staleMatches(
  teamCount: number,
  teams: Team[] | null,
  matchResults: MatchResult[] | null,
  ignoreSlots: number[] = [],
  reserveMode = false
): number[] {
  // MATCH_GRAPH[4] is the standard 8-player bracket. A 7-player bracket has 4
  // teams too but a completely different shape, so validating it here would
  // compare against the wrong graph and produce nonsense. Refuse outright
  // rather than relying on every call site to remember - see
  // staleReserveMatches for the 7-player equivalent.
  if (reserveMode) return [];
  const graph = MATCH_GRAPH[teamCount];
  if (!graph || !teams || !matchResults) return [];

  const stale: number[] = [];
  for (const key of Object.keys(graph)) {
    const slot = Number(key);
    if (ignoreSlots.includes(slot)) continue;
    const stored = matchResults[slot];
    if (!stored?.winner || !stored?.loser) continue;

    const [feedA, feedB] = graph[slot];
    const a = resolveFeed(feedA, teams, matchResults);
    const b = resolveFeed(feedB, teams, matchResults);
    // a feeder that has not been played yet cannot make this stale - that is
    // just an out-of-order bracket, not a contradiction
    if (!a || !b) continue;

    const played = [stored.winner, stored.loser];
    const expected = [a, b];
    const matches =
      (isSameTeam(played[0], expected[0]) && isSameTeam(played[1], expected[1])) ||
      (isSameTeam(played[0], expected[1]) && isSameTeam(played[1], expected[0]));
    if (!matches) stale.push(slot);
  }
  return stale;
}

/** True when a stored result holds exactly this pair of teams, either way round. */
function storedPairMatches(
  stored: MatchResult | undefined,
  a: Team | null,
  b: Team | null
): boolean {
  if (!stored?.winner || !stored?.loser || !a || !b) return true; // nothing to contradict
  return (
    (isSameTeam(stored.winner, a) && isSameTeam(stored.loser, b)) ||
    (isSameTeam(stored.winner, b) && isSameTeam(stored.loser, a))
  );
}

/**
 * The 7-player equivalent of staleMatches.
 *
 * That bracket has no fixed feed graph - its two finals are series spread over
 * several result slots - so the slot-to-slot model does not describe it. The
 * component already derives the entrants for every stage though, and comparing
 * stored results against those catches the same class of contradiction.
 *
 * Returns slot numbers, matching staleMatches.
 */
export function staleReserveMatches(
  teams: Team[] | null,
  matchResults: MatchResult[] | null,
  losersFinalSlots: number[],
  grandFinalSlots: number[]
): number[] {
  if (!teams || !matchResults) return [];
  // M1 is team2 v team3 - fixed seeds, so only team1 and the reserve matter
  const team1 = teams[0];
  const reserve = teams[3];
  const stale: number[] = [];

  // M1 is team2 v team3 - fixed seeds, can never go stale.
  // M2 is team1 v winner of 1.
  if (!storedPairMatches(matchResults[2], team1, matchResults[1]?.winner ?? null))
    stale.push(2);
  // M3 is loser of 1 v loser of 2.
  if (
    !storedPairMatches(
      matchResults[3],
      matchResults[1]?.loser ?? null,
      matchResults[2]?.loser ?? null
    )
  )
    stale.push(3);

  // Losers final series: winner of 3 v the reserve team, every played game.
  const lfA = matchResults[3]?.winner ?? null;
  const lfB = reserve && reserve.length === 2 ? reserve : null;
  for (const slot of losersFinalSlots) {
    if (matchResults[slot]?.winner && !storedPairMatches(matchResults[slot], lfA, lfB))
      stale.push(slot);
  }
  stale.push(...orphanedSeriesGames(lfA, lfB, losersFinalSlots, matchResults));

  // Grand final series: winner of 2 v whoever came out of the losers final.
  // Its opponent is derived, so only check games once both sides are known.
  const gfA = matchResults[2]?.winner ?? null;
  const lfWinner = lastWinnerOf(losersFinalSlots, matchResults);
  for (const slot of grandFinalSlots) {
    if (
      matchResults[slot]?.winner &&
      gfA &&
      lfWinner &&
      !storedPairMatches(matchResults[slot], gfA, lfWinner)
    )
      stale.push(slot);
  }
  stale.push(...orphanedSeriesGames(gfA, lfWinner, grandFinalSlots, matchResults));

  return [...new Set(stale)].sort((a, b) => a - b);
}

/**
 * Games recorded after their series was already decided.
 *
 * Correcting an earlier game can end a series sooner, which strands the games
 * that came after it: both teams are still the right pair, so the entrant check
 * above passes, but the match could not have been played. Those results still
 * score points, so they have to be flagged.
 *
 * Walks the slots in order and counts losses as the series would have seen
 * them - the same bound resolveSeries uses.
 */
function orphanedSeriesGames(
  a: Team | null,
  b: Team | null,
  slots: number[],
  matchResults: MatchResult[]
): number[] {
  if (!a || !b) return [];
  const orphans: number[] = [];
  let decided = false;
  for (const slot of slots) {
    const played = matchResults[slot]?.winner;
    if (!played) continue;
    if (decided) {
      orphans.push(slot);
      continue;
    }
    // count each side's losses up to and including this game
    const lossesA = countLossesUpTo(a, matchResults, slot);
    const lossesB = countLossesUpTo(b, matchResults, slot);
    if (lossesA >= 2 || lossesB >= 2) decided = true;
  }
  return orphans;
}

/** Losses a team has taken in results at or before `upToSlot`. */
function countLossesUpTo(
  team: Team,
  matchResults: MatchResult[],
  upToSlot: number
): number {
  return matchResults.reduce((total, match, slot) => {
    if (slot > upToSlot) return total;
    return match.loser && isSameTeam(match.loser, team) ? total + 1 : total;
  }, 0);
}

/**
 * Human labels for stale slots, as the bracket actually labels them on screen.
 *
 * In the standard brackets a slot number IS the match number, so this is the
 * identity. The 7-player bracket stores its two series across slots 4-10 while
 * only ever displaying Match 1 to 6, so naming a raw slot would send the user
 * looking for a "Match 7" that does not exist.
 */
export function labelStaleSlots(
  slots: number[],
  reserveMode: boolean,
  losersFinalSlots: number[],
  grandFinalSlots: number[],
  losersFinalDecider: boolean
): string[] {
  if (!reserveMode) return slots.map((s) => `Match ${s}`);
  // matches the component: the grand final shifts down one when the losers
  // final needed a decider box
  const grandFinalNumber = losersFinalDecider ? 6 : 5;
  const labels = slots.map((slot) => {
    const lfIndex = losersFinalSlots.indexOf(slot);
    if (lfIndex >= 0) return `Match ${4 + lfIndex}`;
    const gfIndex = grandFinalSlots.indexOf(slot);
    if (gfIndex >= 0) return `Match ${grandFinalNumber + gfIndex}`;
    return `Match ${slot}`;
  });
  // Without a losers decider the two series can render the same number (the
  // losers decider box and the grand final are both "Match 5"), so say which
  // one is meant rather than listing a number twice.
  const duplicated = labels.some((l, i) => labels.indexOf(l) !== i);
  if (!duplicated) return labels;
  return slots.map((slot, i) => {
    if (losersFinalSlots.includes(slot)) return `${labels[i]} (losers final)`;
    if (grandFinalSlots.includes(slot)) return `${labels[i]} (final)`;
    return labels[i];
  });
}

/** Winner of the last played game in a series, or null. */
function lastWinnerOf(
  slots: number[],
  matchResults: MatchResult[]
): Team | null {
  for (let i = slots.length - 1; i >= 0; i--) {
    const w = matchResults[slots[i]]?.winner;
    if (w) return w;
  }
  return null;
}

/**
 * Which matches would be contradicted by changing `slot`, assuming the winner
 * flips. Used to warn before a correction rather than after.
 */
export function downstreamOf(
  slot: number,
  teamCount: number,
  teams: Team[] | null,
  matchResults: MatchResult[] | null,
  reserveMode = false
): number[] {
  if (reserveMode) return [];
  const graph = MATCH_GRAPH[teamCount];
  if (!graph || !teams || !matchResults) return [];

  // flip the slot and see what stops lining up
  const flipped = matchResults.map((m, i) =>
    i === slot && m.winner && m.loser ? { winner: m.loser, loser: m.winner } : m
  );
  const resetSlot = Math.max(...Object.keys(graph).map(Number));
  return staleMatches(teamCount, teams, flipped, [slot, resetSlot]);
}
