import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { message } from "antd";
import { registerSW } from "virtual:pwa-register";

import HomePage from "./components/home-page/HomePage";
import TimeLine from "./components/timeline/TimeLine";
import PowerRankings from "./components/power-rankings/PowerRankings";
import Documentary from "./components/documentary/Documentary";
import Bracket from "./components/bracket/Bracket";
import History from "./components/history/History";

const startApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="bracket" element={<Bracket />} />
          <Route path="rankings" element={<PowerRankings />} />
          <Route path="documentary" element={<Documentary />} />
          <Route path="champs" element={<TimeLine />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
  document.body.classList.add("ready");
};

startApp();
