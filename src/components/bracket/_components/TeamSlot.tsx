import { TeamSlotProps } from "../../../types";
import { SPIN_MARK, LAND_MARK, HOLD_MARK } from "../_helpers/useTeamReveal";

/**
 * One team name inside a match box.
 *
 * This replaces the readonly <input> the brackets used to render. An input can
 * only show a flat string, which ruled out the slot-machine reveal: names need
 * to physically scroll and one player needs to be highlighted while their
 * teammate stays put.
 *
 * The reveal marks a player's name with an invisible character (see
 * useTeamReveal). renderTeamName joins the pair into one string, so the marker
 * can land anywhere in it - the name is split here so only the marked half
 * animates. That keeps all 174 call sites in the bracket components unchanged.
 *
 * Behaves like the old input visually: same .team-input class, same greyed
 * placeholder, still not focusable or selectable.
 */
export default function TeamSlot({
  value,
  placeholder,
  title,
  spinning: spinningProp,
  landed: landedProp,
}: TeamSlotProps) {
  const hasSpin = value.includes(SPIN_MARK);
  const hasLand = value.includes(LAND_MARK);
  const hasHold = value.includes(HOLD_MARK);
  const spinning = spinningProp ?? hasSpin;
  const landed = landedProp ?? hasLand;

  const clean = value
    .split(SPIN_MARK)
    .join("")
    .split(LAND_MARK)
    .join("")
    .split(HOLD_MARK)
    .join("");
  const showPlaceholder = !clean && !!placeholder;

  const className = [
    "team-input",
    showPlaceholder ? "team-input-placeholder" : "",
    // a name already drawn on the team still being picked stays lit, so the
    // whole team holds its highlight until the last name lands
    spinning || hasHold ? "reel-spinning" : "",
    landed ? "reel-landed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  let body;
  if (landed) {
    // the whole team just completed - pop both names together
    body = <span className="reel-landed-name">{clean}</span>;
  } else if (spinning) {
    // split "Marty F - ⁣Kelly V" so only the name being drawn scrolls
    const at = value.indexOf(SPIN_MARK);
    const before = value.slice(0, at).split(HOLD_MARK).join("");
    const after = value.slice(at + SPIN_MARK.length);
    body = (
      <>
        {before}
        <span key={after} className="reel-name">
          {after}
        </span>
      </>
    );
  } else {
    // held (or settled) - no animation, just the text
    body = <span>{showPlaceholder ? placeholder : clean}</span>;
  }

  return (
    <div
      className={className}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      {body}
    </div>
  );
}
