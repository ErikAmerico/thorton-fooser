import { InfoModalProps } from "../../../../types";
import { Modal } from "antd";
import { TrophyFilled } from "@ant-design/icons";
import "./infoModal.css";

export default function InfoModal({ open, onOk }: InfoModalProps) {
  return (
    <Modal
      title=""
      open={open}
      onOk={onOk}
      closable={false}
      cancelButtonProps={{ style: { display: "none" } }}
      okText="Got It."
      okButtonProps={{
        className: "got-it-btn",
      }}
      style={{ textAlign: "center" }}
    >
      <div>
        <span className="">
          ? <span className="">= Reset Match (if needed)</span>
        </span>{" "}
        <br />
        <span className="">
          <TrophyFilled /> <span className="">= Report Winner</span>
        </span>
      </div>
    </Modal>
  );
}
