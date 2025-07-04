import { API } from "../data/constants";

export async function fetchAISummary(results: any[]) {
  const res = await fetch(`${API}/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ results }),
  });

  const data = await res.json();
  return data.summary;
}
