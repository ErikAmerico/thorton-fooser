import { Modal, Radio } from "antd";
import { Team } from "../../../types";
import renderTeamName from "../_helpers/renderTeamName";
import { WhoWonModalProps } from "../../../types";

export default function WhoWonModal({
  open,
  teams,
  selectedWinner,
  onSelect,
  onOk,
  onCancel,
}: WhoWonModalProps) {
  return (
    <Modal
      title="Who Won?"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      closable={false}
      okText="Submit Winner"
      okButtonProps={{ disabled: !selectedWinner }}
      style={{ textAlign: "center" }}
    >
      <Radio.Group
        onChange={(e) => onSelect(e.target.value as Team)}
        value={selectedWinner}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        {teams && (
          <>
            <Radio value={teams.A}>{renderTeamName(teams.A)}</Radio>
            <Radio value={teams.B}>{renderTeamName(teams.B)}</Radio>
          </>
        )}
      </Radio.Group>
    </Modal>
  );
}
