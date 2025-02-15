import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MelChat from "./pages/MelChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/mel" element={<MelChat />} />
      </Routes>
    </Router>
  );
}

export default App;