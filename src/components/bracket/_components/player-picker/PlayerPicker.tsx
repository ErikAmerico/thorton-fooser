import { Checkbox, Button, Spin } from "antd";
import { PlayerFromDB, PlayerPickerProps } from "../../../../types";
import { useState } from "react";
import AddPlayerModal from "../AddPlayerModal";
import { RESERVE_CONFIG } from "../../_helpers/reserveConfig";
import "./playerPicker.css";

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
        className="bracket-scroll-wrapper"
        style={{
          backgroundColor: "black",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin />
      </div>
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

  // The grid flows column-first, so it needs an explicit row count - otherwise
  // every player lands in one long row. Rows are ceil(total / columns), which
  // fills each column top to bottom before starting the next.
  const PICKER_COLUMNS = 3;
  const pickerRows = Math.max(1, Math.ceil(sortedPlayers.length / PICKER_COLUMNS));

  const isOdd = selected.length % 2 === 1;
  const teamCount = Math.ceil(selected.length / 2);
  // odd counts ride along as a reserve bracket where a config exists (7+)
  const oddSupported = Boolean(RESERVE_CONFIG[teamCount]);
  const canGenerate = selected.length >= 4 && (!isOdd || oddSupported);
  return (
    <>
      <h3 style={{ fontFamily: "sans-serif" }} className="whoPlaying-title">
        Who is playing?
      </h3>
      <div
        className="player-grid main-container"
        style={{ gridTemplateRows: `repeat(${pickerRows}, auto)` }}
      >
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
            style={{ color: "white" }}
          >
            <div className="picker-glass">{player.name}</div>
          </Checkbox>
        ))}
      </div>
      <Button
        type="primary"
        disabled={!canGenerate}
        onClick={onGenerate}
        className="generate-bracket-button"
        style={{ marginRight: "5px" }}
      >
        {isOdd && oddSupported
          ? `Generate ${teamCount}-Team Bracket + Reserve`
          : `Generate ${selected.length / 2}-Team Bracket`}
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
