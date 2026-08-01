import { Dispatch, SetStateAction } from "react";

export interface PlayerFromDB {
  id: string;
  name: string;
  score: number;
  championships: number;
}

// normally two players. A reserve team starts with one player and gains a
// partner from the first eliminated team (odd player counts).
export type Team = PlayerFromDB[];

export interface MatchResult {
  winner: Team | null;
  loser: Team | null;
}

export interface BracketProps {
  teams: Team[] | null;
  matchResults: MatchResult[];
  onChange: (newResults: MatchResult[]) => void;
  setIsTourneyFinished: Dispatch<SetStateAction<boolean>>;
  fireConfetti: boolean;
  // odd player count - one team is a reserve team (see reserveConfig.ts)
  reserveMode?: boolean;
  // once results are sent to the backend, matches can no longer be edited -
  // the saved scores would no longer match the bracket
  hasSubmittedResults?: boolean;
  // teams are still spinning into place after generation - names are not final
  isRevealing?: boolean;
}

export interface TeamSlotProps {
  value: string;
  placeholder?: string;
  title?: string;
  // slot-machine reveal state (see useTeamReveal)
  spinning?: boolean;
  landed?: boolean;
}

export interface DonorSelectProps {
  open: boolean;
  reservePlayer: PlayerFromDB | null;
  eliminatedTeam: Team | null;
  onConfirm: (donor: PlayerFromDB) => void;
  // only supplied when reopening an existing pick, so it can be backed out of
  onCancel?: () => void;
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
  // matches already played from this result, which changing it would
  // contradict - shown as a warning once the lock code is entered
  downstream?: number[];
}

export interface ConfirmWinnerArgs {
  currentMatch: number | null;
  selectedWinner: Team | null;
  modalTeams: { A: Team; B: Team } | null;
  matchResults: MatchResult[];
  onChange: (newResults: MatchResult[]) => void;
  closeModal: () => void;
  // slot indices for this bracket, so a reset final that a correction made
  // unnecessary can be discarded instead of lingering in the results
  winnersFinalSlot?: number;
  grandFinalSlot?: number;
  resetFinalSlot?: number;
}

export interface CancelGameProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export interface EndGameProps {
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
  onEndGame: () => void;
  onSubmitResults: () => void;
  onShowInfo: () => void;
  isTourneyFinished: boolean;
  hasSubmittedResults: boolean;
  setIsSummaryModalOpen: Dispatch<SetStateAction<boolean>>;
}

export interface AddPlayerModalProps {
  open: boolean;
  onCancel: () => void;
}

export interface OutletContext {
  players: PlayerFromDB[];
  reloadPlayers: () => void;
  history: HistoryTournament[] | null;
  reloadTournamentHistory: () => void;
}

export interface Tournament {
  id: number;
  createdAt: string;
  teams: Team;
  results: MatchResult;
}

export interface ChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export interface Message {
  userId: string;
  name: string;
  text: string;
  ts: number;
}

export interface SummaryModalProps {
  open: boolean;
  onClose: () => void;
  summary: string;
}
