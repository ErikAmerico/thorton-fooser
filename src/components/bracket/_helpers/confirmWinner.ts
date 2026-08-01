import { ConfirmWinnerArgs } from "../../../types";
import { isSameTeam } from "./isSameTeam";

export default function confirmWinner({
  currentMatch,
  selectedWinner,
  modalTeams,
  matchResults,
  onChange,
  closeModal,
  resetFinalSlot,
  grandFinalSlot,
  winnersFinalSlot,
}: ConfirmWinnerArgs) {
  if (currentMatch == null || !selectedWinner || modalTeams == null) {
    closeModal();
    return;
  }

  const loser = selectedWinner === modalTeams.A ? modalTeams.B : modalTeams.A;

  const newResults = [...matchResults];
  newResults[currentMatch] = {
    winner: selectedWinner,
    loser,
  };

  // Correcting the grand final can remove the need for a reset final that has
  // already been played. That result now describes a game outside the bracket:
  // it would still be scored, and its cell is no longer rendered, so the user
  // could not clear it. Drop it whenever a reset is no longer warranted.
  if (
    resetFinalSlot != null &&
    grandFinalSlot != null &&
    winnersFinalSlot != null &&
    newResults[resetFinalSlot]?.winner
  ) {
    const grandWinner = newResults[grandFinalSlot]?.winner;
    const wbWinner = newResults[winnersFinalSlot]?.winner;
    const resetStillNeeded =
      grandWinner && wbWinner && !isSameTeam(grandWinner, wbWinner);
    if (!resetStillNeeded) {
      newResults[resetFinalSlot] = { winner: null, loser: null };
    }
  }

  onChange(newResults);
  closeModal();
}
