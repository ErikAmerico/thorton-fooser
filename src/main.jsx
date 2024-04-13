import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage.jsx";

export const RootComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <RootComponent />
  </Router>
);
