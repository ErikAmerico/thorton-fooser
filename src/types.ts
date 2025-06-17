import { Dispatch, SetStateAction } from "react";

export interface PlayerFromDB {
  id: string;
  name: string;
  score: number;
  hint: string;
}

export type Team = [PlayerFromDB, PlayerFromDB];

export interface MatchResult {
  winner: Team | null;
  loser: Team | null;
}

export interface BracketProps {
  teams: Team[] | null;
  matchResults: MatchResult[];
  onChange: (newResults: MatchResult[]) => void;
  setIsTourneyFinished: Dispatch<SetStateAction<boolean>>;
}

export interface StoredState {
  selected: PlayerFromDB[];
  teams: Team[] | null;
  matchResults?: MatchResult[] | null;
}
