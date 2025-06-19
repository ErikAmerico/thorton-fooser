import { Modal, Input, Button } from "antd";
import { SubmitResultsProps } from "../../../types";
import { useState } from "react";

export default function SubmitResultsModal({
  open,
  onOk,
  onCancel,
}: SubmitResultsProps) {
  const [secretCode, setSecretCode] = useState("");
  const isDisabled = !secretCode;

  const confirm = () => {
    onOk(secretCode);
    setSecretCode("");
  };

  const cancel = () => {
    setSecretCode("");
    onCancel();
  };

  return (
    <Modal
      title="Submit Results"
      open={open}
      onOk={confirm}
      okButtonProps={{
        disabled: isDisabled,
        style: {
          backgroundColor: isDisabled ? "gray" : "green",
          borderColor: isDisabled ? "gray" : "green",
          color: isDisabled ? "black" : "white",
        },
      }}
      onCancel={cancel}
      closable={false}
      okText="Submit"
      style={{ textAlign: "center" }}
    >
      Submit results and update rankings. Cannot update results after
      submission.
      <div>
        <Input
          placeholder="Enter Secret Access Code"
          type="password"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
          style={{ width: "205px" }}
        />
      </div>
    </Modal>
  );
}
