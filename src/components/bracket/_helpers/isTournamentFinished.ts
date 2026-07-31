import { useEffect } from "react";
import { isTournamentFinsihedProps } from "../../../types";

export default function isTournamentFinsihed({
  resetWinner,
  tournamentOver,
  setIsTourneyFinished,
}: isTournamentFinsihedProps) {
  // Tracks the bracket in BOTH directions. Correcting a winner can reopen a
  // finished tournament (a reset final becomes necessary again), so this must
  // clear as well as set - otherwise the champion banner would linger and
  // announce a team that has not actually won yet.
  useEffect(() => {
    setIsTourneyFinished(Boolean(tournamentOver || resetWinner));
  }, [tournamentOver, resetWinner, setIsTourneyFinished]);
}
