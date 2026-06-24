import React from "react";
import ReactDOM from "react-dom/client";
//import App from "./App";
import StoryPage from "./StoryPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/story/:id" element={<StoryPage />} />
    </Routes>
  </BrowserRouter>
);
