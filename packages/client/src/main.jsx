import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "./hooks/useAuth";
import App from "./App";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

const Root = () => {
  const [loading, setLoading] = useState(true);

  //simulate MongoDB connection
  useEffect(() => {
    const time = setTimeout(() => {
      setLoading(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ProvideAuth>
        {loading ? <LoadingSpinner full={true} /> : <App />}
      </ProvideAuth>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
