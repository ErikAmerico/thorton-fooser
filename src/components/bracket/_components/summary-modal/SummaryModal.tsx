import { Modal } from "antd";
import { useEffect, useState, useRef } from "react";
import { SummaryModalProps } from "../../../../types";
import "./summaryModal.css";

export default function SummaryModal({
  open,
  onClose,
  summary,
}: SummaryModalProps) {
  const [displayedText, setDisplayedText] = useState("");
  const idx = useRef(0);
  const displayTextRef = useRef("");

  useEffect(() => {
    if (!open) return;

    idx.current = 0;
    displayTextRef.current = "";
    setDisplayedText("");

    const intervalId = setInterval(() => {
      if (idx.current < summary.length) {
        displayTextRef.current += summary[idx.current];
        setDisplayedText(displayTextRef.current);
        idx.current += 1;
      } else {
        clearInterval(intervalId);
      }
    }, 5);

    return () => {
      clearInterval(intervalId);
      idx.current = 0;
      displayTextRef.current = "";
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
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "2rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#00ffcc",
            marginTop: "-10px",
          }}
        >
          The Neural Report
        </h1>

        {summary ? (
          <div className="summary-content" style={{ whiteSpace: "pre-wrap" }}>
            {displayedText}
          </div>
        ) : (
          <>
            <div className="loader-container">
              <div className="loader-text">Thinking...</div>
              <div className="loader-orbit">
                <div className="loader-dot">
                  <div className="loader-trail"></div>
                  <div className="loader-trail2"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </Modal>
  );
}
