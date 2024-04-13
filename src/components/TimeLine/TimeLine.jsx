import { Timeline } from "antd";
import "./timeLine.css";
const TimeLine = () => {
  return (
    <div id="history-container">
      <h2>The Champions</h2>
      <Timeline
        mode={"right"}
        items={[
          {
            label: "10/14/2023",
            children: "Ofir & Michelle",
          },
          {
            label: "11/4/2023",
            children: "Ofir & Michelle",
          },
          {
            label: "12/10/2023",
            children: "Ofir & Michelle",
          },
          {
            label: "1/13/2024",
            children: "Erik & Anna",
          },
          {
            label: "2/17/2024",
            children: "Ofir & Michelle",
          },
          {
            label: "3/23/2024",
            children: "Brittany & Zach",
          },
          {
            label: "4/20/2024",
            children: "TBD",
          },
        ]}
      />
    </div>
  );
};
export default TimeLine;
