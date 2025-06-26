import { MatchResult } from "../../../types";

export function calculateScores(
  matchResults: MatchResult[] | null | undefined,
  isTourneyFinished: boolean
): Record<string, number> {
  if (!isTourneyFinished) return {};

  const winnerMap: Record<string, number> = {};
  const loserMap: Record<string, number> = {};

  matchResults?.forEach((match) => {
    if (!match.winner || !match.loser) return;

    match.winner.forEach((player) => {
      winnerMap[player.id] = (winnerMap[player.id] || 0) + 1;
    });

    match.loser.forEach((player) => {
      loserMap[player.id] = (loserMap[player.id] || 0) + 0.25;
    });
  });

  const allIds = new Set<string>([
    ...Object.keys(winnerMap),
    ...Object.keys(loserMap),
  ]);

  const finalScores: Record<string, number> = {};

  allIds.forEach((id) => {
    const wins = winnerMap[id] || 0;
    const losses = loserMap[id] || 0;
    finalScores[id] = wins - losses + 3;
  });

  return finalScores;
}
