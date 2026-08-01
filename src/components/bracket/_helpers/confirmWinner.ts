import { ConfirmWinnerArgs, Team } from "../../../types";
import { isSameTeam } from "./isSameTeam";
import { SPIN_MARK, LAND_MARK, HOLD_MARK } from "./useTeamReveal";

/**
 * The slot-machine reveal prefixes invisible markers onto player names while a
 * draw is in progress. Those are display-only, but a match recorded during the
 * reveal would carry them into matchResults, localStorage and the backend, so
 * strip them at the one place every result is written.
 */
function stripReveal(team: Team): Team {
  return team.map((player) =>
    player.name.includes(SPIN_MARK) ||
    player.name.includes(LAND_MARK) ||
    player.name.includes(HOLD_MARK)
      ? {
          ...player,
          name: player.name
            .split(SPIN_MARK)
            .join("")
            .split(LAND_MARK)
            .join("")
            .split(HOLD_MARK)
            .join(""),
        }
      : player
  );
}

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
    winner: stripReveal(selectedWinner),
    loser: stripReveal(loser),
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
