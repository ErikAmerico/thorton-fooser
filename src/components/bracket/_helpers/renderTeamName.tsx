import { Team } from "../../../types";

export default function renderTeamName(team?: Team | null | undefined) {
  if (!team) return "";
  return `${team[0].name} - ${team[1].name}`;
}
