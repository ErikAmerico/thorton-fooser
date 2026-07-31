import { Team } from "../../../types";

export default function renderTeamName(team?: Team | null | undefined) {
  if (!team) return "";
  // solo reserve team - partner comes from the first eliminated team
  if (team.length === 1) return `${team[0].name} - ?`;
  return `${team[0].name} - ${team[1].name}`;
}
