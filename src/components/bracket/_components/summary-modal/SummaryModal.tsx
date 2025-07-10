import { Modal } from "antd";
import { useEffect, useState } from "react";
import { SummaryModalProps } from "../../../../types";
import "./summaryModal.css";

export default function SummaryModal({
  open,
  onClose,
  summary,
}: SummaryModalProps) {
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
          <div className="summary-wrapper">
            <div
              className={"summary-content fade-in"}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {summary}
            </div>
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
