import "./homePage.css";
import Timer from "./Countdown/Countdown";
import TimeLine from "./TimeLine/TimeLine";
import PowerRankings from "./PowerRankings/powerRankings";
import { Row, Col, notification } from "antd";
import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth > 991) {
      notification.open({
        message: "Optimal Viewing Experience",
        description: "This page is best viewed on mobile devices and tablets.",
        duration: 10,
        style: {
          backgroundColor: "#f0f0f0",
          border: "1px solid maroon",
          borderRadius: "10px",
          cursor: "default",
        },
      });
    }
  }, []);

  return (
    <>
      <div>
        <Row gutter={[0, 16]}>
          <Col
            xs={{ span: 20, offset: 2, order: 1 }}
            md={{ span: 16, offset: 4, order: 1 }}
            lg={{ span: 6, offset: 4, order: 1 }}
          >
            <Timer />
          </Col>
          <Col
            xs={{ span: 20, offset: 2, order: 3 }}
            md={{ span: 16, offset: 4, order: 3 }}
            lg={{ span: 6, offset: 4, order: 2 }}
          >
            <TimeLine />
          </Col>
          <Col
            xs={{ span: 24, offset: 0, order: 2 }}
            md={{ span: 20, offset: 2, order: 2 }}
            lg={{ span: 6, offset: 4, order: 3 }}
          >
            <div className="reigning-champ-container">
              <h1 className="reigning-champ-title">Reigning Champs</h1>
              <h4 className="reigning-champ-team">
                Brickwall-Brittany & Michelle
              </h4>
              <div className="reigning-champ-image"></div>
            </div>
          </Col>
          <Col
            xs={{ span: 24, offset: 0, order: 4 }}
            md={{ span: 20, offset: 2, order: 4 }}
            lg={{ span: 6, offset: 4, order: 4 }}
          >
            <div className="powerrankings-container">
              <h1 className="powerrankings-title">Power Rankings</h1>
              <p>scoring details coming soon</p>
              <PowerRankings />
            </div>
          </Col>
        </Row>
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
