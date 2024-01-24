import React from "react";
import { Route, Routes } from "react-router-dom";
import { Col, Row, ToastContainer } from "react-bootstrap";
import { useProvideAuth } from "./hooks/useAuth";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
//import HomePage from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import UploadProfilePhoto from "./components/UploadProfilePhoto/UploadProfilePhoto";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import FeedPage from "./pages/FeedPage";

const App = () => {
  const {
    state: { user },
  } = useProvideAuth();

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          <Route path="/profile/u/:uname" element={<ProfilePage />} />
          <Route path="/upload" element={<UploadProfilePhoto />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default App;
