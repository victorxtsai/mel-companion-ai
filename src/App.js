import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MelChat from "./pages/MelChat";
import SignIn from './pages/SignIn';

// path "/" means default, if you want another ending, then like "/profile" or something...
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MelChat />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;