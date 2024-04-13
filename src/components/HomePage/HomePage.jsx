import "./homePage.css";
import Timer from "./Countdown/Countdown";
import TimeLine from "./TimeLine/TimeLine";
import { Row, Col } from "antd";

const HomePage = () => {
  return (
    <>
      <div>
        <Row>
          <Col
            xs={{ span: 22, offset: 1 }}
            md={{ span: 16, offset: 4 }}
            lg={{ span: 6, offset: 4 }}
          >
            <Timer />
          </Col>
          <Col
            xs={{ span: 22, offset: 1 }}
            md={{ span: 16, offset: 4 }}
            lg={{ span: 6, offset: 2 }}
          >
            <TimeLine />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePage;
