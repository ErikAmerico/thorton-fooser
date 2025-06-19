import { StoredState } from "../types";

export const MAX_PLAYERS = 14;
export const STORAGE_KEY = "bracketState";

export const initialState: StoredState = {
  selected: [],
  teams: null,
  matchResults: null,
};
