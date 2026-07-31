import { Team } from "../../../types";

export function isSameTeam(teamA: Team, teamB: Team): boolean {
  // after you reload from JSON (i.e. your matchResults coming out of localStorage),
  // even if the two teams really are the same pair of players,
  // they’re two different array instances in memory.
  // always be true once you’ve rehydrated from JSON,
  // because semiWinner and grandWinner were serialized (and then parsed)
  // into two distinct arrays with identical contents.
  if (teamA.length !== teamB.length) return false;
  return teamA.every((player, i) => player.id === teamB[i].id);
}
