import { Row, Col } from "antd";
import "./footer.css";

const Footer = () => {
  return (
    <div id="footer-container">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col id="footer-title">
          <img id="footer-logo" src="assets/trophy.png" alt="" />
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
