import { StoredState } from "../types";

export const MAX_PLAYERS = 18;
export const STORAGE_KEY = "bracketState";

export const initialState: StoredState = {
  selected: [],
  teams: null,
  matchResults: null,
};

export const API = import.meta.env.VITE_API_BASE_URL;
export const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
export const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;
