import "./homePage.css";
import Timer from "../Countdown/Countdown";
import TimeLine from "../TimeLine/TimeLine";
import { Row, Col } from "antd";

const HomePage = () => {
  return (
    <>
      <div>
        <Row>
          <Col lg={12}>
            <h1>NEXT TOURNAMENT: 4/20/2024 @ 8 PM</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Timer />
          </Col>
          <Col lg={12}>
            <TimeLine />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <img src="/assets/trophyImage.png" alt="" id="trophy-image" />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePage;
