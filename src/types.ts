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

export interface isTournamentFinsihedProps {
  resetWinner: Team | null;
  tournamentOver: boolean | null;
  setIsTourneyFinished: Dispatch<SetStateAction<boolean>>;
}

export interface WhoWonModalProps {
  open: boolean;
  teams: { A: Team; B: Team } | null;
  selectedWinner: Team | null;
  onSelect: (team: Team) => void;
  onOk: () => void;
  onCancel: () => void;
}

export interface ConfirmWinnerArgs {
  currentMatch: number | null;
  selectedWinner: Team | null;
  modalTeams: { A: Team; B: Team } | null;
  matchResults: MatchResult[];
  onChange: (newResults: MatchResult[]) => void;
  closeModal: () => void;
}
