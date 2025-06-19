import { API } from "../data/constants";

export async function batchUpdateScores(
  finalScores: Record<string, number>,
  code: string
) {
  const res = await fetch(`${API}/matches/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-code": code,
    },
    body: JSON.stringify({ finalScores }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "could not submit results!");
  }
}
