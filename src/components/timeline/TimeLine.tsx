import "./timeLine.css";
import { TrophyFilled } from "@ant-design/icons";
import { Modal, Spin, message } from "antd";
import { useState, useEffect } from "react";
import { OutletContext, HistoryTournament } from "../../types";
import { useOutletContext } from "react-router-dom";

interface Champion {
  name: string;
  date: string;
  photo?: React.ReactNode;
}

const TimeLine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Champion | null>(null);
  const { history } = useOutletContext<OutletContext>();
  const [showHm, setShowHm] = useState(false);
  const [validSlugs, setValidSlugs] = useState<Set<string>>(new Set());

  const getChampions = (results: HistoryTournament["results"]) => {
    for (let i = results.length - 1; i >= 0; i--) {
      const { winner } = results[i];
      if (winner) {
        return `${winner[0].name} & ${winner[1].name}`;
      }
    }
    return "";
  };

  const makeItems = (historyArr: HistoryTournament[] | null): Champion[] => {
    if (!historyArr) return [];
    return historyArr
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((tourn) => {
        const tourneyDate = new Date(tourn.createdAt);
        const month = tourneyDate.getUTCMonth() + 1;
        const day = tourneyDate.getUTCDate();
        const year = tourneyDate.getUTCFullYear();

        const date = `${month}/${day}/${year}`;

        const slug = `${month}-${day}-${year}`;

        const photo = validSlugs.has(slug) ? (
          <img
            src={`/assets/${slug}.png`}
            alt={`Champions on ${date}`}
            style={{ width: "300px" }}
          />
        ) : undefined;

        const name = getChampions(tourn.results) || "TBD";

        return { name, date, photo };
      });
  };

  useEffect(() => {
    if (!history) return;
    history.forEach((tourn) => {
      const tourneyDate = new Date(tourn.createdAt);
      const slug = `${
        tourneyDate.getUTCMonth() + 1
      }-${tourneyDate.getUTCDate()}-${tourneyDate.getUTCFullYear()}`;
      const img = new Image();
      img.src = `/assets/${slug}.png`;
      img.onload = () => {
        setValidSlugs((prev) => new Set(prev).add(slug));
      };
    });
  }, [history]);

  const items = makeItems(history);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHm(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (history === null || items.length === 0) {
    return (
      <div className="timeline-page">
        <Spin style={{ margin: "auto", display: "block" }} />
        {showHm && <h2 style={{ color: "gray" }}>hm.</h2>}
      </div>
    );
  }

  const openModal = (item: Champion) => {
    if (!item.photo) {
      message.warning(`No champion photo for this match. Do you have one?`);
      return;
    }

    setSelected(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
  };

  return (
    <div className="timeline-page">
      <div className="main-container">
        <div id="history-container">
          <h2 className="champ-title">Past Champions</h2>
          <table className="champions-table">
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span className="champ-glass">{item.name}</span>
                  </td>
                  <td>
                    <span className="trophy-wrapper">
                      <TrophyFilled
                        onClick={() => openModal(item)}
                        className="champ-trophy"
                      />
                    </span>
                  </td>
                  <td>
                    <span className="champ-glass">{item.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        className="custom-modal"
        centered
        open={isOpen}
        onOk={closeModal}
        okButtonProps={{
          className: "got-it-btn",
        }}
        okText="Lookin Good!"
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {selected?.photo || <p>No photo available</p>}
      </Modal>
    </div>
  );
};
export default TimeLine;
