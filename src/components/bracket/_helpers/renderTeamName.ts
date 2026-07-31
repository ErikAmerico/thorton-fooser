import { Team } from "../../../types";

export default function renderTeamName(team?: Team | null | undefined) {
  if (!team) return "";
  // solo reserve team - partner comes from the first eliminated team
  if (team.length === 1) return `${team[0].name} - ?`;
  // during the slot-machine reveal a slot can be blank until its name lands;
  // show nothing rather than a bare " - "
  if (!team[0].name && !team[1].name) return "";
  if (!team[1].name) return team[0].name;
  return `${team[0].name} - ${team[1].name}`;
}
