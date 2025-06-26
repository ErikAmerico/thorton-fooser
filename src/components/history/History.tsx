import { useEffect, useState } from "react";
import { OutletContext } from "../../types";
import { useOutletContext } from "react-router-dom";
import { RenderBracket } from "../bracket/_components/BracketRenderer";
import { Spin, Alert, Button, Modal } from "antd";

import {
  LeftOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import "./history.css";

export default function History() {
  const { history } = useOutletContext<OutletContext>();
  const [idx, setIdx] = useState(0);
  const [showLookingForModal, setShowLookingForModal] = useState(false);

  const openModal = () => {
    setShowLookingForModal(true);
  };

  useEffect(() => {
    if (history && history.length > 0) {
      setIdx(0);
    }
  }, [history]);

  if (!history) {
    return (
      <div
        className="bracket-scroll-wrapper"
        style={{
          backgroundColor: "black",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin />
      </div>
    );
  }

  const current = history[idx];

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(history.length - 1, i + 1));

  return (
    <div className="bracket-scroll-wrapper">
      <div className="history-header">
        <Button icon={<LeftOutlined />} onClick={prev} disabled={idx === 0} />
        <h2 className="tourney-date">
          {new Date(current.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })}
        </h2>
        <Button
          icon={<RightOutlined />}
          onClick={next}
          disabled={idx === history.length - 1}
        />
        <InfoCircleOutlined
          onClick={openModal}
          className="infoCircle history-info"
          style={{ color: "white" }}
        />
      </div>

      <div className="history-bracket">
        {RenderBracket(current.teams.length, {
          teams: current.teams,
          matchResults: current.results,
          onChange: () => {},
          setIsTourneyFinished: () => {},
          fireConfetti: false,
        })}
      </div>
      <Modal
        open={showLookingForModal}
        onOk={() => setShowLookingForModal(false)}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="I'll keep an eye out."
        okButtonProps={{
          className: "got-it-btn",
        }}
        style={{ textAlign: "center" }}
      >
        <div className="missing-info">
          Missing data of Tournament Brackets from: <br />
          <span className="missing-info-content">
            10/14/2023 <br /> 11/4/2023 <br /> 12/10/2023 <br /> 1/13/2024{" "}
            <br /> 3/23/2024 <br /> <br />
          </span>
          Do you have a picture of one?
        </div>
      </Modal>
    </div>
  );
}
