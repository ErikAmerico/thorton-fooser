import { Row, Col } from "antd";
import { MessageTwoTone } from "@ant-design/icons";
import ChatBox from "./ChatBox";
import "./footer.css";
import { useState } from "react";

const Footer = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <div id="footer-container">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col id="footer-title">
          <img id="footer-logo" src="assets/trophy.png" alt="" />
        </Col>
      </Row>

      <span
        className="footer-messaging-logo-container"
        onClick={showDrawer}
        style={{ cursor: "pointer" }}
        role="button"
        aria-label="Open chat"
      >
        <MessageTwoTone
          twoToneColor={["black", "#866900"]}
          className="footer-messaging-logo"
        />
      </span>

      <ChatBox open={open} onClose={onClose} />
    </div>
  );
};

export default Footer;
