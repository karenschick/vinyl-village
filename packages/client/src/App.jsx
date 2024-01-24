import React from "react";
import { Route, Routes } from "react-router-dom";
import { Col, Row, ToastContainer } from "react-bootstrap";
import { useProvideAuth } from "./hooks/useAuth";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import UploadProfilePhoto from "./components/UploadProfilePhoto/UploadProfilePhoto";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";

const App = () => {
  const {
    state: { user },
  } = useProvideAuth();

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/profile/u/:uname" element={<ProfilePage />} /> */}
          <Route path="/upload" element={<UploadProfilePhoto />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default App;
