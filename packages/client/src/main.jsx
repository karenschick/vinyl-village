import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "./hooks/useAuth";
import { ToastContainer } from "react-toastify";
import App from "./App";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import "react-toastify/dist/ReactToastify.css";

const root = createRoot(document.getElementById("root"));

const Root = () => {
  const [loading, setLoading] = useState(true);

  // Simulate MongoDB connection
  useEffect(() => {
    const time = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(time);
  }, []);

  return (
    <BrowserRouter>
      <ProvideAuth>
        <ToastContainer />
        {loading ? <LoadingSpinner full={true} /> : <App />}
      </ProvideAuth>
    </BrowserRouter>
  );
};

root.render(<Root />);
