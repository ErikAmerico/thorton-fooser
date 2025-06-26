import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { useEffect, useState } from "react";
import { fetchPlayers } from "./api/players";
import { PlayerFromDB } from "./types";
import { message } from "antd";
import useStartPageAtTop from "./utils/startPageAtTop";

function App() {
  const [players, setPlayers] = useState<PlayerFromDB[]>([]);

  // Ensures that we start at the top of the page when the route changes
  // instead of staying at the same scroll position
  useStartPageAtTop();

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
