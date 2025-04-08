// Import necessary hooks and modules from React and React Router
import { useReducer, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../util/api"; // Import custom API utility for making HTTP requests

// Define initial authentication state
const initialState = {
  isAuthenticated: null,
  user: null,
};

// Define reducer function to manage authentication-related state changes
const reducer = (state, action) => {
  switch (action.type) {
    // Handle login action by setting isAuthenticated to true and storing user data
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    // Handle user update by merging new data with existing user state
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    // Handle logout by clearing local storage and resetting state
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    // Return current state for any unknown actions
    default:
      return state;
  }
};

// Create a context for sharing authentication state and dispatch function
const authContext = createContext();

// ProvideAuth component wraps the app and provides authentication state to children components
export function ProvideAuth({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState); // Set up reducer with initial state
  return (
    <authContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

/// Custom hook to allow child components to access authentication state and dispatch function
export const useAuth = () => {
  return useContext(authContext);
};

// Custom hook to manage authentication operations like signin, signup, and 
export function useProvideAuth() {
  const { state, dispatch } = useAuth(); // Access state and dispatch from auth context
  let navigate = useNavigate(); // useNavigate hook for navigation post-signout

  // Retrieve currently logged-in user from local storage
  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("MernAppUser"));
  };

  // Update user information and dispatch to state
  const updateUser = (userData) => {
    //console.log("User Before update:", state.user);
    dispatch({ type: "UPDATE_USER", payload: userData });
    //console.log("User After update:", state.user);
  };

  // Signin function that authenticates user credentials and updates state
  const signin = async (username, password) => {
    try {
      const response = await api.post(`/auth/signin`, {
        username: username,
        password: password,
      });
      // Store user data in local storage and update state on successful signin
      localStorage.setItem("MernAppUser", JSON.stringify(response.data));
      dispatch({
        type: "LOGIN",
        payload: response.data,
      });
      return response;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.error); // Show error from response data
      } else {
        throw error;
      }
    }
  };

  // Signup function to create a new user and auto-signin after successful signup
  const signup = async (
    username,
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    city,
    state,
    profile_image
  ) => {
    try {
      // Send user data to backend for registration
      await api.post(`/auth/signup`, {
        username,
        email,
        password,
        firstName,
        lastName,
        city,
        state,
        profile_image,
        confirmPassword: confirmPassword,
      });
      // Automatically sign the user in after registration
      return await signin(username, password);
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.error); // Display error from response data
      } else {
        throw error;
      }
    }
  };

  // Signout function clears authentication state and navigates back to the home page
  const signout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/"); // Redirect to the home page
  };

  // Effect hook to re-authenticate user if local storage has saved user data
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("MernAppUser")) || false;
    if (savedUser) {
      dispatch({
        type: "LOGIN",
        payload: savedUser,
      });
    } else {
      dispatch({
        type: "LOGOUT",
      });
    }
  }, [dispatch]);

  // Return authentication state and helper functions to be used by other components
  return {
    state,
    getCurrentUser,
    signin,
    signup,
    signout,
    updateUser,
  };
}
