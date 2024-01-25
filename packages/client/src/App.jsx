import React from "react";
import { Route, Routes } from "react-router-dom";
import { Col, Row, ToastContainer } from "react-bootstrap";
import { useProvideAuth } from "./hooks/useAuth";
import RegisterPage from "./pages/RegisterPage";
import PostDetailPage from "./components/PostDetail/PostDetailPage";
import ProfilePage from "./pages/ProfilePage";
//import HomePage from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import UploadProfilePhoto from "./components/UploadProfilePhoto/UploadProfilePhoto";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import FeedPage from "./pages/FeedPage";
import EditProfile from "./components/EditProfile/EditProfile";


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
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/u/:uname" element={<ProfilePage />} />
          <Route path="/upload" element={<UploadProfilePhoto />} />
          {/* <Route path="/p/:postId" element={<PostDetailPage />} /> */}
          <Route exact path="/p/:pid" element={<PostDetailPage />} />
          <Route path="/u/:uname/edit" element={<EditProfile />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default App;
