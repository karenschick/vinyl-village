import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <Routes>
        <Route exact path="" element={<HomePage />} />
        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  
);
