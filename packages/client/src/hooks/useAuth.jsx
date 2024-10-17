import { useReducer, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../util/api";

const initialState = {
  isAuthenticated: null,
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
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

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
export function useProvideAuth() {
  const { state, dispatch } = useAuth();
  let navigate = useNavigate();

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("MernAppUser"));
  };

  const updateUser = (userData) => {
    //console.log("User Before update:", state.user);
    dispatch({ type: "UPDATE_USER", payload: userData });
    //console.log("User After update:", state.user);
  };
  // useEffect(() => {
  //   console.log("User updated:", state.user);
  // }, [state.user]);

  const signin = async (username, password) => {
    try {
      const response = await api.post(`/auth/signin`, {
        username: username,
        password: password,
      });
      localStorage.setItem("MernAppUser", JSON.stringify(response.data));
      dispatch({
        type: "LOGIN",
        payload: response.data,
      });
      return response;
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.error);
      } else {
        throw error;
      }
    }
  };

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
      return await signin(username, password);
    } catch (error) {
      console.log(error);
      if (error.response) {
        throw new Error(error.response.data.error);
      } else {
        throw error;
      }
    }
  };

  const signout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };

  // const getCurrentUser = () => {
  //   return JSON.parse(localStorage.getItem("MernAppUser"));
  // };

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

  // Return the user object and auth methods
  return {
    state,
    getCurrentUser,
    signin,
    signup,
    signout,
    updateUser,
  };
}
