import { Checkbox, Button } from "antd";
import { PlayerFromDB, PlayerPickerProps } from "../../../types";
import { useState } from "react";
import AddPlayerModal from "./AddPlayerModal";

export default function PlayerPicker({
  players,
  selected,
  maxPlayers,
  onToggle,
  onGenerate,
}: PlayerPickerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (players.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#1d1d1d",
          height: "100%",
          width: "100%",
        }}
      ></div>
    );
  }

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

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
        style={{ marginRight: "5px" }}
      >
        Generate {selected.length / 2}-Team Bracket
      </Button>

      <Button
        id="add-player-button"
        type="primary"
        style={{ marginLeft: "5px" }}
        onClick={openAddModal}
      >
        Add Player
      </Button>
      <AddPlayerModal open={isAddModalOpen} onCancel={closeAddModal} />
    </>
  );
}
