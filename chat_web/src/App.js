import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./Components/Chat";
import Home from "./Components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
