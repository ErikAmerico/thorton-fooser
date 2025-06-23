import { Dispatch, SetStateAction } from "react";

export interface PlayerFromDB {
  id: string;
  name: string;
  score: number;
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

export interface HistoryTournament {
  id: number;
  createdAt: string;
  teams: Team[];
  results: MatchResult[];
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
  okDisabled: boolean;
}

export interface ConfirmWinnerArgs {
  currentMatch: number | null;
  selectedWinner: Team | null;
  modalTeams: { A: Team; B: Team } | null;
  matchResults: MatchResult[];
  onChange: (newResults: MatchResult[]) => void;
  closeModal: () => void;
}

export interface CancelGameProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export interface SubmitResultsProps {
  open: boolean;
  onOk: (secretCode: string) => void;
  onCancel: () => void;
}

export interface InfoModalProps {
  open: boolean;
  onOk: () => void;
}

export interface PlayerPickerProps {
  players: PlayerFromDB[];
  selected: PlayerFromDB[];
  maxPlayers: number;
  onToggle: (player: PlayerFromDB, checked: boolean) => void;
  onGenerate: () => void;
}

export interface BracketControlsProps {
  onCancelGame: () => void;
  onSubmitResults: () => void;
  onShowInfo: () => void;
  isTourneyFinished: boolean;
}

export interface AddPlayerModalProps {
  open: boolean;
  onCancel: () => void;
}

export interface OutletContext {
  players: PlayerFromDB[];
  reloadPlayers: () => void;
}

export interface Tournament {
  id: number;
  createdAt: string;
  teams: Team;
  results: MatchResult;
}
