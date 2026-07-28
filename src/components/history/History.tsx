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
  const [showHm, setShowHm] = useState(false);

  //I am adding results to tournament history for tournaments we don't have the full data on.
  //We know the winner. So I am making it a 1 match tournament with a null loser and the known winner.
  //I do not want to display that on the History page. - Well, We can't display it on the history page
  // RenderBracket would throw an error.
  //so filter out the tournaments where the results array.length is 1
  // newest first - we open on the most recent tournament and the right
  // arrow walks back in time
  const validHistory = (
    history?.filter((tournament) => tournament.results.length > 1) ?? []
  )
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const openModal = () => {
    setShowLookingForModal(true);
  };

  useEffect(() => {
    if (history && history.length > 0) {
      setIdx(0);
    }
  }, [history]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHm(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
        <Spin style={{ margin: "auto" }} />
        {showHm && <h2 style={{ color: "gray", marginLeft: "10px" }}>hm.</h2>}
      </div>
    );
  }

  if (!validHistory.length) {
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
        <Spin style={{}} />
        {showHm && <h2 style={{ color: "gray", marginLeft: "10px" }}>hm.</h2>}
      </div>
    );
  }

  const currentIdx = Math.min(idx, validHistory.length - 1);
  const current = validHistory[currentIdx];

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(validHistory.length - 1, i + 1));

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
          disabled={currentIdx === validHistory.length - 1}
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
