import { API } from "../data/constants";

export async function fetchPlayers() {
  const res = await fetch(`${API}/players`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch players (${res.status}): ${res.statusText}`
    );
  }
  return res.json();
}

export async function addPlayer(name: string, code: string) {
  const res = await fetch(`${API}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-code": code,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "could not add player");
  }
}
