import "./documentary.css";

export default function Documentary() {
  return (
    <div className="doc-page">
      <div className="main-container">
        <div id="doc-container">
          <p id="doc-title">The Documentary</p>
          <video controls poster={"/assets/poster.png"}>
            <source src={"/assets/FoosballMP4.mp4"} type={"video/mp4"} />
          </video>
        </div>
      </div>
    </div>
  );
}
