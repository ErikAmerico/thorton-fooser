import { useEffect } from "react";
import { isTournamentFinsihedProps } from "../../../types";

export default function isTournamentFinsihed({
  resetWinner,
  tournamentOver,
  setIsTourneyFinished,
}: isTournamentFinsihedProps) {
  useEffect(() => {
    if (tournamentOver || resetWinner) {
      setIsTourneyFinished(true);
    }
  }, [tournamentOver, resetWinner, setIsTourneyFinished]);
}
