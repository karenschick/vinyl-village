import React from "react"; // Import React to define components
import { Route, Routes } from "react-router-dom"; // Import routing components from React Router
import { useProvideAuth } from "./hooks/useAuth"; // Custom hook for authentication state management
import RegisterPage from "./pages/RegisterPage/RegisterPage"; // Component for user registration page
import ProfilePage from "./pages/ProfilePage"; // Component for user profile page
import LandingPage from "./pages/LandingPage/LandingPage"; // Component for the landing page
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap for styling
import "./index.css"; // Import custom styles
import ErrorBoundary from "./components/ErrorBoundary"; // Component for catching and handling errors
import EditAddPage from "./pages/EditAddPage/EditAddPage"; // Component for editing/adding user details
import FeedPage from "./pages/FeedPage/FeedPage"; // Component for displaying the feed page
import "bootstrap/dist/css/bootstrap.min.css";
import PostDetailPage from "./pages/PostDetail/PostDetailPage"; // Component for viewing post details

// Main application component
const App = () => {
  const {
    state: { user }, // Destructure the `user` state from the authentication hook
  } = useProvideAuth();

  return (
    <>
      {/* Wrap application routes with an error boundary to handle runtime errors gracefully */}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/u/:uname" element={<ProfilePage />} />
          <Route exact path="/p/:pid" element={<PostDetailPage />} />
          <Route path="/u/:uname/edit" element={<EditAddPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default App;
