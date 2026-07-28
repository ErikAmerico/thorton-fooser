import { Modal } from "antd";
import { EndGameProps } from "../../../types";

export default function EndGameModal({ open, onOk, onCancel }: EndGameProps) {
  return (
    <Modal
      title="End this game?"
      open={open}
      onOk={onOk}
      okButtonProps={{ danger: true }}
      onCancel={onCancel}
      cancelText="Nevermind"
      closable={false}
      okText="End Game"
      style={{ textAlign: "center" }}
      cancelButtonProps={{
        className: "cancel-nvrmind-btn",
      }}
    >
      Results have already been saved. Ending the game clears the bracket so a
      new one can be built.
    </Modal>
  );
}
