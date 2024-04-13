import { Row, Col } from "antd";
import "./footer.css";

const Footer = () => {
  return (
    <div id="footer-container">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col id="footer-title">
          <img id="footer-logo" src="assets/trophy.png" alt="" />
        </Col>
        <Col id="footer-contact-info">
          <p id="footer-message">
            Email Erik for address details with the subject `Foosball`
          </p>
          <p id="footer-email">olsonerik91@gmail.com</p>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
