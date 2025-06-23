import { StoredState } from "../types";

export const MAX_PLAYERS = 18;
export const STORAGE_KEY = "bracketState";

export const initialState: StoredState = {
  selected: [],
  teams: null,
  matchResults: null,
};

// export const API = "http://localhost:3000"; //DEVELOPMENT
// export const API = "http://10.0.0.151:3000";
export const API = "https://thornton-fooser-api.onrender.com"; //PRODUCTION
