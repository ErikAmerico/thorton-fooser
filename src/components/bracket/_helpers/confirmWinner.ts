import { ConfirmWinnerArgs } from "../../../types";

export default function confirmWinner({
  currentMatch,
  selectedWinner,
  modalTeams,
  matchResults,
  onChange,
  closeModal,
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

  onChange(newResults);
  closeModal();
}
