import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Outlet />
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default App;
