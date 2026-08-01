import { Modal, Radio, Input, Button, message } from "antd";
import { Team } from "../../../types";
import renderTeamName from "../_helpers/renderTeamName";
import { WhoWonModalProps } from "../../../types";
import { useEffect, useState } from "react";

export default function WhoWonModal({
  open,
  teams,
  selectedWinner,
  onSelect,
  onOk,
  onCancel,
  okDisabled,
  downstream,
}: WhoWonModalProps) {
  const [lockCode, setLockCode] = useState("");
  const [isLocked, setIsLocked] = useState(okDisabled);
  const isDisabled = !selectedWinner || isLocked;

  useEffect(() => {
    if (open) {
      setIsLocked(okDisabled);
      setLockCode("");
    }
  }, [open, okDisabled]);

  const handleOk = () => {
    onOk();
    setIsLocked(true);
  };

  const handleCancel = () => {
    onCancel();
    setIsLocked(okDisabled);
    setLockCode("");
  };

  const tryUnlock = () => {
    if (lockCode === "lockylock") {
      setIsLocked(false);
      setLockCode("");
    } else {
      message.error("Wrong lock code");
    }
  };

  return (
    <Modal
      title="Who Won?"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      closable={false}
      okText="Submit Winner"
      okButtonProps={{
        disabled: isDisabled,
        style: {
          backgroundColor: isDisabled ? "#aaa" : "green",
          borderColor: isDisabled ? "#aaa" : "green",
        },
      }}
      style={{ textAlign: "center" }}
      cancelButtonProps={{
        className: "cancel-nvrmind-btn",
      }}
    >
      <Radio.Group
        onChange={(e) => onSelect(e.target.value as Team)}
        value={selectedWinner}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        {teams && (
          <>
            <Radio value={teams.A}>{renderTeamName(teams.A)}</Radio>
            <Radio value={teams.B}>{renderTeamName(teams.B)}</Radio>
          </>
        )}
        {isLocked && (
          <div>
            <span>
              <Button
                style={{ backgroundColor: "green", marginRight: "10px" }}
                onClick={tryUnlock}
              >
                Unlock
              </Button>
            </span>
            <Input
              placeholder="Enter Toggle Lock Code"
              type="password"
              value={lockCode}
              onChange={(e) => setLockCode(e.target.value)}
              style={{ width: "205px" }}
            />
          </div>
        )}
      </Radio.Group>

      {/* Changing this result would contradict matches already played from it.
          Those store the old teams and still score points, so say so before
          the change rather than leaving a bracket that cannot happen. */}
      {!isLocked && downstream && downstream.length > 0 && (
        <div className="downstream-warning">
          <b>Heads up:</b> changing this result affects{" "}
          {downstream.length === 1
            ? `Match ${downstream[0]}`
            : `Matches ${downstream.slice(0, -1).join(", ")} and ${
                downstream[downstream.length - 1]
              }`}
          , already played from it. Replay {downstream.length === 1 ? "it" : "them"}{" "}
          after this to keep the bracket correct.
        </div>
      )}
    </Modal>
  );
}
