// Import necessary hooks and modules
import { useEffect } from "react";
import { useAuth } from "./useAuth"; // Import custom hook for authentication context
import { useNavigate } from "react-router-dom"; // Import navigation hook from React Router

// Custom hook to enforce authentication and redirect if user is not logged in
export function useRequireAuth(redirectUrl = "/login") {
  const auth = useAuth(); // Get authentication state and dispatch from useAuth
  let navigate = useNavigate(); // Initialize navigate function for redirecting

  // useEffect hook checks the user's authentication status and redirects if not logged in
  useEffect(() => {
    if (auth.state.isAuthenticated === false) {
      // Redirect to specified URL if not authenticated
      navigate(redirectUrl);
    }
  }, [auth, navigate, redirectUrl]); // Dependencies: re-run if auth, navigate, or redirectUrl changes

  // Return auth object so the calling component can access authentication details
  return auth;
}
