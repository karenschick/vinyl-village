import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { ProvideAuth } from "./hooks/useAuth";
import { ToastContainer } from "react-toastify";
import App from "./App";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import "react-toastify/dist/ReactToastify.css";

// Create a root element for rendering the React application
const root = createRoot(document.getElementById("root"));

// Root component that sets up application context and routing
const Root = () => {
  const [loading, setLoading] = useState(true); // State to manage loading status

  // Simulate MongoDB connection
  useEffect(() => {
    const time = setTimeout(() => {
      setLoading(false); // Set loading to false after the delay
    }, 1000); // 1-second delay
    return () => clearTimeout(time); // Cleanup timeout when component unmounts
  }, []);

  return (
    <HashRouter>
      {/* Wrap application with authentication provider */}
      <ProvideAuth>
        {/* Add a toast container for global notifications */}
        <ToastContainer />
        {/* Show a loading spinner while loading, otherwise render the main application */}
        {loading ? <LoadingSpinner full={true} /> : <App />}
      </ProvideAuth>
    </HashRouter>
  );
};

// Render the Root component into the root DOM element
root.render(<Root />);
