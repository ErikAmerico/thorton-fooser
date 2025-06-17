import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { StoredState } from "../../../types";

const STORAGE_KEY = "bracketState"; //eventually be in .env file
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
