import { Checkbox, Button } from "antd";
import { PlayerFromDB, PlayerPickerProps } from "../../../types";

export default function PlayerPicker({
  players,
  selected,
  maxPlayers,
  onToggle,
  onGenerate,
}: PlayerPickerProps) {
  const sortedPlayers = [...players].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <h3 style={{ color: "#fff", fontFamily: "sans-serif" }}>
        Who is playing?
      </h3>
      <div className="player-grid">
        {sortedPlayers.map((player: PlayerFromDB) => (
          <Checkbox
            key={player.id}
            checked={selected.some((s) => s.id === player.id)}
            disabled={
              !selected.some((s) => s.id === player.id) &&
              selected.length >= maxPlayers
            }
            onChange={(e) => {
              onToggle(player, e.target.checked);
            }}
          >
            {player.name}
          </Checkbox>
        ))}
      </div>
      <Button
        type="primary"
        disabled={selected.length < 4 || selected.length % 2 !== 0}
        onClick={onGenerate}
        className="generate-bracket-button"
      >
        Generate {selected.length / 2}-Team Bracket
      </Button>
    </>
  );
}
