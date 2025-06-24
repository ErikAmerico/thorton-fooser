import "./timeLine.css";
import { TrophyFilled } from "@ant-design/icons";
import { Modal, message, Spin } from "antd";
import { useState } from "react";

interface Champion {
  name: string;
  date: string;
  photo?: React.ReactNode;
}

const TimeLine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Champion | null>(null);

  const items = [
    { name: "TBD", date: "TBD" },
    {
      name: "Rachel & Ofir",
      date: "6/7/2025",
      photo: (
        <img src="assets/ofirRachelPNG.png" alt="" style={{ width: "300px" }} />
      ),
    },
    {
      name: "Ofir & Erik",
      date: "6/21/2024",
      photo: (
        <img src="assets/ofir&erik.png" alt="" style={{ width: "300px" }} />
      ),
    },
    {
      name: "Brittany & Michelle",
      date: "5/18/2024",
      photo: (
        <img
          src="assets/brittany&michelle.png"
          alt=""
          style={{ width: "300px" }}
        />
      ),
    },
    {
      name: "Brittany & Erik",
      date: "4/20/2024",
      photo: (
        <img src="assets/erik_britt.png" alt="" style={{ width: "300px" }} />
      ),
    },
    {
      name: "Brittany & Zach",
      date: "3/23/2024",
      photo: (
        <img src="assets/britt&zach.png" alt="" style={{ width: "300px" }} />
      ),
    },
    {
      name: "Ofir & Michelle",
      date: "2/17/2024",
    },
    {
      name: "Erik & Anna",
      date: "1/13/2024",

      photo: <img src="assets/1-13.png" alt="" style={{ width: "300px" }} />,
    },
    { name: "Ofir & Michelle", date: "12/10/2023" },
    {
      name: "Ofir & Michelle",
      date: "11/4/2023",
      photo: <img src="assets/11-4.png" alt="" style={{ width: "300px" }} />,
    },
    {
      name: "Ofir & Michelle",
      date: "10/14/2023",
    },
  ];

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
              {items.map((item) => (
                <tr key={item.date}>
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
        key={selected?.date}
        destroyOnHidden
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
        {!selected && <Spin />}
        {selected?.photo || <p>No photo available</p>}
      </Modal>
    </div>
  );
};
export default TimeLine;
