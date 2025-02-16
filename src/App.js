import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MelChat from "./pages/MelChat";

// path "/" means default, if you want another ending, then like "/profile" or something...
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MelChat />} />
      </Routes>
    </Router>
  );
}

export default App;