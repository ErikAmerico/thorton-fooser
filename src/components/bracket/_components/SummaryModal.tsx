import { Modal } from "antd";
import { useEffect, useState } from "react";
import { SummaryModalProps } from "../../../types";

export default function SummaryModal({
  open,
  onClose,
  summary,
}: SummaryModalProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!open) return;

    setDisplayedText("");
    let i = 0;

    const startTyping = () => {
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + summary.charAt(i));
        i++;
        if (i >= summary.length) clearInterval(interval);
      }, 50);
      return interval;
    };

    const delay = setTimeout(() => {
      startTyping();
    }, 200);

    return () => {
      clearTimeout(delay);
    };
  }, [open, summary]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      className="summary-modal"
      maskClosable={false}
      keyboard={false}
    >
      <>
        <h1
          style={{
            textAlign: "center",
            fontFamily:
              "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
            fontSize: "3rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#367bca",
          }}
        >
          The Boston Herald
        </h1>
        <div className="summary-content" style={{ whiteSpace: "pre-wrap" }}>
          {summary ? displayedText : "Grabbing a pen..."}
        </div>
      </>
    </Modal>
  );
}
