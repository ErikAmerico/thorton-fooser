import "./timeLine.css";
import { TrophyFilled } from "@ant-design/icons";

const TimeLine = () => {
  const items = [
    { name: "TBD", date: "TBD" },
    { name: "Rachel & Ofir", date: "6/7/2025" },
    { name: "Ofir & Erik", date: "6/21/2024" },
    { name: "Brittany & Michelle", date: "5/18/2024" },
    { name: "Brittany & Erik", date: "4/20/2024" },
    { name: "Brittany & Zach", date: "3/23/2024" },
    { name: "Ofir & Michelle", date: "2/17/2024" },
    { name: "Erik & Anna", date: "1/13/2024" },
    { name: "Ofir & Michelle", date: "12/10/2023" },
    { name: "Ofir & Michelle", date: "11/4/2023" },
    { name: "Ofir & Michelle", date: "10/14/2023" },
  ];

  return (
    <div className="timeline-page">
      <div className="main-container">
        <div id="history-container">
          <h2 className="champ-title">Past Champions</h2>
          <table className="champions-table">
            <tbody>
              {items.map(({ name, date }) => (
                <tr key={date}>
                  <td>
                    <span className="champ-glass">{name}</span>
                  </td>
                  <td>
                    <span className="trophy-wrapper">
                      <TrophyFilled className="champ-trophy" />
                    </span>
                  </td>
                  <td>
                    <span className="champ-glass">{date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TimeLine;
