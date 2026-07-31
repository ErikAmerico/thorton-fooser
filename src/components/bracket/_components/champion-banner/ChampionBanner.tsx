import { Team } from "../../../../types";
import renderTeamName from "../../_helpers/renderTeamName";
import "./championBanner.css";

export default function ChampionBanner({ champion }: { champion: Team | null }) {
  if (!champion) return null;

  return (
    <div className="champion-banner" key={renderTeamName(champion)}>
      <div className="champion-banner-inner">
        <span className="champion-banner-label">Champions</span>
        <span className="champion-banner-names">
          {renderTeamName(champion)}
        </span>
      </div>
    </div>
  );
}
