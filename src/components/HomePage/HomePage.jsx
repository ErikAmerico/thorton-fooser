import "./homePage.css";
import Timer from "./Countdown/Countdown";
import TimeLine from "./TimeLine/TimeLine";
import PowerRankings from "./PowerRankings/powerRankings";
import { Row, Col } from "antd";

const HomePage = () => {
  return (
    <>
      <div>
        <Row gutter={[0, 16]}>
          <Col xs={{ span: 20, offset: 2, order: 1 }} className="column">
            <Timer />
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24, offset: 0, order: 2 }} className="column">
            <div className="reigning-champ-container">
              <h1 className="reigning-champ-title">Reigning Champs</h1>
              <h4 className="reigning-champ-team">Rachel & Ofir</h4>
              <div className="reigning-champ-image"></div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 20, offset: 2, order: 3 }} className="column">
            <TimeLine />
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24, offset: 0, order: 4 }} className="column">
            <div className="powerrankings-container">
              <h1 className="powerrankings-title">Power Rankings</h1>
              <PowerRankings />
            </div>
          </Col>
        </Row>
        <hr />
        <div id="doc-container">
          <p id="doc-title">The Documentary</p>
          <video controls poster={"/assets/poster.png"}>
            <source src={"/assets/FoosballMP4.mp4"} type={"video/mp4"} />
          </video>
        </div>
      </div>
    </>
  );
};

export default HomePage;
