// import "./homePage.css";
// import Timer from "./Countdown/Countdown";
// import TimeLine from "./TimeLine/TimeLine";
// import { Row, Col } from "antd";

// const HomePage = () => {
//   return (
//     <>
//       <div>
//         <Row>
//           <Col
//             xs={{ span: 22, offset: 1 }}
//             md={{ span: 16, offset: 4 }}
//             lg={{ span: 6, offset: 4 }}
//           >
//             <Timer />
//           </Col>
//           <Col
//             xs={{ span: 22, offset: 1 }}
//             md={{ span: 16, offset: 4 }}
//             lg={{ span: 6, offset: 2 }}
//           >
//             <TimeLine />
//           </Col>
//         </Row>
//         <Row>
//           <Col
//             xs={{ span: 22, offset: 1 }}
//             md={{ span: 16, offset: 4 }}
//             lg={{ span: 6, offset: 4 }}
//           >
//             <div className="reigning-champ-container">
//               <h1 className="reigning-champ-title">Reigning Champs</h1>
//               <h4 className="reigning-champ-team">Brickwall Brittany & Zach</h4>
//               <div className="reigning-champ-image"></div>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </>
//   );
// };

// export default HomePage;

import "./homePage.css";
import Timer from "./Countdown/Countdown";
import TimeLine from "./TimeLine/TimeLine";
import { Row, Col } from "antd";

const HomePage = () => {
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
            xs={{ span: 20, offset: 2, order: 2 }}
            md={{ span: 16, offset: 4, order: 2 }}
            lg={{ span: 6, offset: 4, order: 3 }}
          >
            <div className="reigning-champ-container">
              <h1 className="reigning-champ-title">Reigning Champs</h1>
              <h4 className="reigning-champ-team">Brickwall-Brittany & Zach</h4>
              <div className="reigning-champ-image"></div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HomePage;
