import { useEffect, useState } from "react";
import { fetchTournamentHistory } from "../../api/matches";
import { HistoryTournament } from "../../types";
import { RenderBracket } from "../bracket/_components/BracketRenderer";
import { Spin, Alert, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./history.css";

export default function History() {
  const [history, setHistory] = useState<HistoryTournament[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetchTournamentHistory()
      .then((data) => {
        setHistory(data);
        setIdx(0);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <Alert type="error" message={error} />;
  }
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
      </div>

      <div className="history-bracket">
        {RenderBracket(current.teams.length, {
          teams: current.teams,
          matchResults: current.results,
          onChange: () => {},
          setIsTourneyFinished: () => {},
        })}
      </div>
    </div>
  );
}
