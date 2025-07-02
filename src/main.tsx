import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// registerSW({ immediate: true });

const updateServiceWorker = registerSW({
  immediate: true,
  onNeedRefresh() {
    // A new SW has been downloaded and is waiting to activate.
    // Force a reload so the fresh assets take over immediately:
    console.log("New version available – reloading page.");
    location.reload();
  },
  // onOfflineReady() {
  //   console.log("App is ready to work offline.");
  // },
  onRegistered(r) {
    r && setInterval(() => r.update(), 1000 * 60 * 20);
  },
});

updateServiceWorker();

// if ("serviceWorker" in navigator) {
//   registerSW({
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     onRegistered(r: any) {
//       r &&
//         setInterval(() => {
//           console.log("Updating worker...");
//           r.update();
//         }, 1000 * 60 * 20);
//     },
//   });
// }
