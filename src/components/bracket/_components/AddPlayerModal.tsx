import { useState } from "react";
import { AddPlayerModalProps } from "../../../types";
import { Modal, Input, message } from "antd";
import { addPlayer } from "../../../api/players";

export default function AddPlayerModal({
  open,
  onCancel,
}: AddPlayerModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [secretCode, setSecretCode] = useState("");

  let isDisabled = !playerName || !secretCode;

  const confirm = async () => {
    try {
      await addPlayer(playerName, secretCode);
      message.success(`Player “${playerName}” added!`);
      setPlayerName("");
      setSecretCode("");
      onCancel();
    } catch (err: any) {
      message.error(err.message || "Could not add player");
    }
  };

  const cancel = () => {
    setSecretCode("");
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={cancel}
      closable={false}
      onOk={confirm}
      okText="Add Player"
      okButtonProps={{
        style: {
          backgroundColor: isDisabled ? "rgb(113, 144, 172)" : "green",
          color: "white",
        },
        disabled: isDisabled,
      }}
      style={{ textAlign: "center" }}
    >
      <h2>Who is joining us?</h2>
      <div>
        <Input
          placeholder="Enter Secret Access Code"
          type="text"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
          style={{ width: "205px" }}
        />
      </div>
      <br />
      <div>
        <Input
          placeholder="Player Name"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={{ width: "205px" }}
        />
      </div>
    </Modal>
  );
}
