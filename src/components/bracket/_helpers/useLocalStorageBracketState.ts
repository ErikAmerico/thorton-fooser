import { useState, useEffect } from "react";
import { StoredState } from "../../../types";
import { STORAGE_KEY } from "../../../data/keys";

const initialState: StoredState = {
  selected: [],
  teams: null,
  matchResults: null,
};

export function useLocalStorageBracketState() {
  const [bracketState, setBracketState] = useState<StoredState>(() => {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (json) return JSON.parse(json);
    } catch {}
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bracketState));
  }, [bracketState]);

  return [bracketState, setBracketState] as const;
}
