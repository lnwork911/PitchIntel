import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Articles from "./pages/Articles";
// import Article from "./pages/Article";
// import WorldCup from "./pages/WorldCup";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/articles" element={<Articles />} />

      {/*
      <Route path="/article/:id" element={<Article />} />
      <Route path="/world-cup" element={<WorldCup />} />
      */}

    </Routes>
  );
}
