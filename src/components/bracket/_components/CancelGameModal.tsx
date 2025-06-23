import { Modal, Input, Button, message } from "antd";
import { CancelGameProps } from "../../../types";
import { useEffect, useState } from "react";

export default function CancelGameModal({
  open,
  onOk,
  onCancel,
}: CancelGameProps) {
  const [lockCode, setLockCode] = useState("");
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("LockCancelKey");
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("LockCancelKey", JSON.stringify(isLocked));
  }, [isLocked]);

  const toggleLock = () => {
    if (lockCode === "lockylock") {
      setIsLocked((prev) => !prev);
      setLockCode("");
    } else {
      message.error("Wrong lock code");
    }
  };

  return (
    <Modal
      title="Are you sure?"
      open={open}
      onOk={onOk}
      okButtonProps={{ danger: true, disabled: isLocked }}
      onCancel={onCancel}
      cancelText="Nevermind"
      closable={false}
      okText="Cancel"
      style={{ textAlign: "center" }}
      cancelButtonProps={{
        className: "cancel-nvrmind-btn",
      }}
    >
      Canceling this game will lose all progress. It will be like it never
      existed.
      <br />
      <br />
      <div>
        <span>
          <Button
            style={{ backgroundColor: "green", marginRight: "10px" }}
            onClick={toggleLock}
          >
            {isLocked ? "Unlock" : "Lock"}
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
    </Modal>
  );
}
