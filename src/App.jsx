import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/Index";
import LinkResolver from "./pages/LinkResolver";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/link/:code" element={<LinkResolver />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
