import { Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { BracketControlsProps } from "../../../types";

export default function BracketControls({
  onCancelGame,
  onSubmitResults,
  onShowInfo,
  isTourneyFinished,
}: BracketControlsProps) {
  return (
    <div className="bracket-controls">
      <Button className="cancel-tourney-btn" onClick={onCancelGame}>
        Cancel Game
      </Button>
      <Button
        className="submit-results-btn"
        onClick={onSubmitResults}
        disabled={!isTourneyFinished}
        style={{ backgroundColor: "green", borderColor: "green" }}
      >
        Submit Results
      </Button>
      <InfoCircleOutlined
        onClick={onShowInfo}
        className="infoCircle"
        style={{ color: "white" }}
      />
    </div>
  );
}
