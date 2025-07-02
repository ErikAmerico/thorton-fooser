import "./homePage.css";
import Timer from "./countdown/Countdown";

const HomePage = () => {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-content">
          <Timer />
        </div>
      </header>

      <section className="champs">
        <div className="champs-content">
          <h1 className="champs-title">Reigning Champzz</h1>
          <h3 className="champs-teams">Rachel &amp; Ofir</h3>
          <div
            className="champs-image"
            style={{ backgroundImage: `url(/assets/6-7-2025.png)` }}
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
