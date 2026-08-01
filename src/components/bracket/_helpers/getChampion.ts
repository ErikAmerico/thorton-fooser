import { MatchResult, Team } from "../../../types";
import { isSameTeam } from "./isSameTeam";

/** How many matches this team has lost across the whole bracket. */
function countLosses(team: Team, matchResults: MatchResult[]): number {
  return matchResults.reduce(
    (total, match) =>
      match.loser && isSameTeam(match.loser, team) ? total + 1 : total,
    0
  );
}

/**
 * The champion of a finished bracket, or null while it is still in progress.
 *
 * A bracket ends one of two ways:
 *   - the winners-bracket team wins the grand final outright, or
 *   - the losers-bracket team wins it, forcing a reset final that then decides
 *     the title.
 *
 * So the champion is the reset final's winner when one was played, otherwise
 * the grand final's winner - but ONLY when no reset is pending. Taking the
 * last decided match instead would crown whoever won most recently, which is
 * wrong the moment a correction reopens the bracket.
 *
 *   gf  slot of the grand final
 *   wb  slot whose winner reached the grand final undefeated
 *   rf  slot of the reset final
 */
function championOf(
  matchResults: MatchResult[],
  wb: number,
  gf: number,
  rf: number
): Team | null {
  const grandWinner = matchResults[gf]?.winner ?? null;
  const wbWinner = matchResults[wb]?.winner ?? null;
  if (!grandWinner || !wbWinner) return null;

  // The undefeated team won the grand final - no reset is needed, so the title
  // is already decided. A reset result may still be sitting in slot rf from
  // before a correction; it describes a game that no longer belongs to this
  // bracket, so it must not be read here.
  const winner = isSameTeam(grandWinner, wbWinner)
    ? grandWinner
    : // the losers-bracket team won, so the reset final decides it
      matchResults[rf]?.winner ?? null;

  // Double elimination: the champion cannot have lost twice. A correction can
  // leave a slot naming a team that has since been eliminated, so verify the
  // result rather than trusting it - otherwise Submit would post scores that
  // crown a team with two losses.
  if (winner && countLosses(winner, matchResults) >= 2) return null;
  return winner;
}

// teamCount -> [winners-final slot, grand-final slot, reset-final slot]
const CHAMPION_SLOTS: Record<number, [number, number, number]> = {
  2: [1, 2, 3],
  3: [2, 4, 5],
  4: [4, 6, 7],
  5: [6, 8, 9],
  6: [8, 10, 11],
  7: [10, 12, 13],
  8: [12, 14, 15],
  9: [14, 16, 17],
};

/**
 * Champion of the bracket, or null while it is still in progress.
 *
 * The 7-player reserve bracket ends differently: both finals are series played
 * until a team has 2 losses, so its champion comes from the series resolver
 * rather than from fixed slots.
 */
export function getChampion(
  matchResults: MatchResult[] | null | undefined,
  teamCount: number,
  reserveChampion?: Team | null
): Team | null {
  if (!matchResults) return null;
  if (reserveChampion !== undefined) {
    // same sanity check as the standard path - a series resolver reading
    // corrected slots can also name a team that has since lost twice
    if (reserveChampion && countLosses(reserveChampion, matchResults) >= 2) {
      return null;
    }
    return reserveChampion;
  }

  const slots = CHAMPION_SLOTS[teamCount];
  if (!slots) return null;
  return championOf(matchResults, ...slots);
}
