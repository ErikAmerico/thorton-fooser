import { API } from "../data/constants";
import { MatchResult, Team, HistoryTournament } from "../types";

export async function batchUpdateScores(
  finalScores: Record<string, number>,
  teams: Team[],
  matchResults: MatchResult[],
  code: string
) {
  const res = await fetch(`${API}/matches/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-code": code,
    },
    body: JSON.stringify({ finalScores, matchResults, teams }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "could not submit results!");
  }
}

export async function fetchTournamentHistory(): Promise<HistoryTournament[]> {
  const res = await fetch(`${API}/matches/history`);
  if (!res.ok) {
    throw new Error(`Error loading history: ${res.statusText}`);
  }
  return res.json();
}
