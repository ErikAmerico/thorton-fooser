import "./homePage.css";
import Timer from "../Countdown/Countdown";
import TimeLine from "../TimeLine/TimeLine";
import { Row, Col } from "antd";

const HomePage = () => {
  return (
    <>
      <div>
        <h1>NEXT TOURNAMENT: 4/20/2024 8 PM</h1>
        <Row>
          <Col span={12}>
            <Timer />
          </Col>
          <Col span={12}>
            <TimeLine />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePage;
