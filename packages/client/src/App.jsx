import React from "react";
import { Route, Routes } from "react-router-dom";
import { useProvideAuth } from "./hooks/useAuth";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import PostDetailPage from "./components/PostDetail/PostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage/LandingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import UploadProfilePhoto from "./components/UploadProfilePhoto/UploadProfilePhoto";
import ErrorBoundary from "./components/ErrorBoundary";
import EditAddPage from "./pages/EditAddPage/EditAddPage";
import FeedPage from "./pages/FeedPage/FeedPage";
import "bootstrap/dist/css/bootstrap.min.css";

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
          <Route exact path="/p/:pid" element={<PostDetailPage />} />
          <Route path="/u/:uname/edit" element={<EditAddPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default App;
