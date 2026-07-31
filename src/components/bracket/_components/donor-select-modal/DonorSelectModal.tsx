import { Modal, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { DonorSelectProps } from "../../../../types";
import renderTeamName from "../../_helpers/renderTeamName";
import "./donorSelectModal.css";

export default function DonorSelectModal({
  open,
  reservePlayer,
  eliminatedTeam,
  onConfirm,
}: DonorSelectProps) {
  const [highlight, setHighlight] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    if (open) {
      setHighlight(null);
      setPicked(null);
      setSpinning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [open]);

  if (!reservePlayer || !eliminatedTeam) return null;

  // alternate the highlight between the two players, slowing down each hop
  // until it lands - random hop count makes the landing spot random
  const spin = () => {
    if (spinning) return;
    setPicked(null);
    setSpinning(true);
    const hops = 10 + Math.floor(Math.random() * 6);
    let count = 0;
    let delay = 90;
    const step = (idx: number) => {
      setHighlight(idx);
      count++;
      if (count >= hops) {
        setPicked(idx);
        setSpinning(false);
        return;
      }
      delay = Math.min(delay * 1.22, 650);
      timerRef.current = setTimeout(() => step(1 - idx), delay);
    };
    step(Math.random() < 0.5 ? 0 : 1);
  };

  const choose = (idx: number) => {
    if (spinning) return;
    setHighlight(idx);
    setPicked(idx);
  };

  const donor = picked !== null ? eliminatedTeam[picked] : null;

  return (
    <Modal
      title="The Reserve Team Needs a Partner!"
      open={open}
      closable={false}
      footer={null}
      style={{ textAlign: "center" }}
    >
      {renderTeamName(eliminatedTeam)} were the first team eliminated. One of
      them gets a second life alongside <b>{reservePlayer.name}</b>. Pick a
      player, or let fate decide.
      <div className="donor-cards">
        {eliminatedTeam.map((player, idx) => (
          <button
            key={player.id}
            className={[
              "donor-card",
              highlight === idx ? "donor-highlight" : "",
              picked === idx ? "donor-picked" : "",
            ]
              .join(" ")
              .trim()}
            onClick={() => choose(idx)}
            disabled={spinning}
          >
            {player.name}
          </button>
        ))}
      </div>
      <div className="donor-actions">
        <Button className="donor-random-btn" onClick={spin} disabled={spinning}>
          {spinning ? "Choosing..." : "Let Fate Decide"}
        </Button>
        <Button
          className="donor-confirm-btn"
          disabled={!donor || spinning}
          onClick={() => donor && onConfirm(donor)}
        >
          {donor && !spinning ? `Lock In ${donor.name}` : "Lock In"}
        </Button>
      </div>
    </Modal>
  );
}
