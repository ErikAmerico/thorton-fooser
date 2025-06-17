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
      onCancel={onCancel}
      closable={false}
      okText="Confirm"
      style={{ textAlign: "center" }}
    >
      Canceling this game will lose all progress. It will be like it never
      existed.
    </Modal>
  );
}
