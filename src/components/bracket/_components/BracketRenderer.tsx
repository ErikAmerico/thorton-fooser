import { BracketProps } from "../../../types";
import TwoTeamBracket from "../team-count-brackets/2-team-bracket/TwoTeamBracket";
import ThreeTeamBracket from "../team-count-brackets/3-team-bracket/ThreeTeamBracket";
import FourTeamBracket from "../team-count-brackets/4-team-bracket/FourTeamBracket";
import FiveTeamBracket from "../team-count-brackets/5-team-bracket/FiveTeamBracket";
import SixTeamBracket from "../team-count-brackets/6-team-bracket/SixTeamBracker";
import SevenTeamBracket from "../team-count-brackets/7-team-bracket/SevenTeamBracket";
import EightTeamBracket from "../team-count-brackets/8-team-bracket/EightTeamBracket";
import NineTeamBracket from "../team-count-brackets/9-team-bracket/NineTeamBracket";

export function RenderBracket(teamCount: number, props: BracketProps) {
  switch (teamCount) {
    case 2:
      return <TwoTeamBracket {...props} />;
    case 3:
      return <ThreeTeamBracket {...props} />;
    case 4:
      // 7 players restructure this same bracket via props.reserveMode so the
      // reserve team still gets true double elimination
      return <FourTeamBracket {...props} />;
    case 5:
      return <FiveTeamBracket {...props} />;
    case 6:
      return <SixTeamBracket {...props} />;
    case 7:
      return <SevenTeamBracket {...props} />;
    case 8:
      return <EightTeamBracket {...props} />;
    case 9:
      return <NineTeamBracket {...props} />;
    default:
      return null;
  }
}
