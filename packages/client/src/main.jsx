import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "./hooks/useAuth";
import App from "./App";



ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </BrowserRouter>
);
