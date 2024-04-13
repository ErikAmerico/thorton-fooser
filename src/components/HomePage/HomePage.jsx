import "./homePage.css";
import Timer from "../Countdown/Countdown";
import TimeLine from "../TimeLine/TimeLine";
import { Row, Col } from "antd";

const HomePage = () => {
  return (
    <>
      <div>
        <Row>
          <Col lg={24}>
            <h1>NEXT TOURNAMENT: 4/20/2024 @ 8 PM</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={6} offset={3}>
            <Timer />
          </Col>
          <Col lg={6} offset={3}>
            <TimeLine />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePage;
