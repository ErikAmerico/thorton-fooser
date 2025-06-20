import { Team } from "../../../types";

export function isSameTeam(teamA: Team, teamB: Team): boolean {
  // after you reload from JSON (i.e. your matchResults coming out of localStorage),
  // even if the two teams really are the same pair of players,
  // they’re two different array instances in memory.
  // always be true once you’ve rehydrated from JSON,
  // because semiWinner and grandWinner were serialized (and then parsed)
  // into two distinct arrays with identical contents.
  return teamA[0].id === teamB[0].id && teamA[1].id === teamB[1].id;
}
