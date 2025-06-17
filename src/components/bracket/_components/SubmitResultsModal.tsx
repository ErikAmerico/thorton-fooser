import { Modal } from "antd";
import { SubmitResultsProps } from "../../../types";

export default function SubmitResultsModal({
  open,
  onOk,
  onCancel,
}: SubmitResultsProps) {
  return (
    <Modal
      title="Submit Results"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      closable={false}
      okText="Submit"
      style={{ textAlign: "center" }}
    >
      Submit results and update rankings. Cannot update results after
      submission.
    </Modal>
  );
}
