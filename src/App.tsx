import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { useEffect, useState } from "react";
import { fetchPlayers } from "./api/players";
import { PlayerFromDB } from "./types";
import { message } from "antd";

function App() {
  const [players, setPlayers] = useState<PlayerFromDB[]>([]);

  const reloadPlayers = () => {
    fetchPlayers()
      .then((data) => {
        console.log("fetched players", data);
        setPlayers(data);
      })
      .catch((err) => {
        console.error("Failed to load players", err);
        message.error("Couldn't load players");
      });
  };

  useEffect(() => {
    reloadPlayers();
  }, []);

  useEffect(() => {
    function scheduleNightlyReload(hour = 3, minute = 0) {
      console.log("3 am schedule?");
      const now = new Date();
      const next = new Date();
      next.setHours(hour, minute, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      const ms = next.getTime() - now.getTime();
      setTimeout(() => {
        window.location.replace(
          `${window.location.origin}${window.location.pathname}?t=${Date.now()}`
        );
        setInterval(
          () =>
            window.location.replace(
              `${window.location.origin}${
                window.location.pathname
              }?t=${Date.now()}`
            ),
          24 * 60 * 60 * 1000
        );
      }, ms);
    }
    scheduleNightlyReload(3, 0);
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Outlet context={{ players, reloadPlayers }} />
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default App;
