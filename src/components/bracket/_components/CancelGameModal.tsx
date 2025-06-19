import { Modal } from "antd";
import { CancelGameProps } from "../../../types";

export default function CancelGameModal({
  open,
  onOk,
  onCancel,
}: CancelGameProps) {
  return (
    <Modal
      title="Are you sure?"
      open={open}
      onOk={onOk}
      okButtonProps={{ danger: true }}
      onCancel={onCancel}
      cancelText="Nevermind"
      closable={false}
      okText="Cancel"
      style={{ textAlign: "center" }}
    >
      Canceling this game will lose all progress. It will be like it never
      existed.
    </Modal>
  );
}
