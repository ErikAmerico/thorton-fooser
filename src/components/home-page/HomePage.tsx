import "./homePage.css";
import Timer from "./countdown/Countdown";
import { Row, Col } from "antd";

const HomePage = () => {
  return (
    <div className="main-container">
      <Row gutter={[0, 16]}>
        <Col xs={{ span: 20, offset: 2, order: 1 }}>
          <Timer />
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24, offset: 0, order: 2 }}>
          <div className="reigning-champ-container">
            <h1 className="reigning-champ-title">Reigning Champs</h1>
            <h4 className="reigning-champ-team">Rachel & Ofir</h4>
            <div className="reigning-champ-image"></div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
