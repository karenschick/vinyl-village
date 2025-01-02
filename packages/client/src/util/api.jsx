import { useState, useEffect } from "react";
// const API_URL = "http://localhost:3001/api";
import axios from "axios"; // Library for HTTP requests
import { toast } from "react-toastify";
import { API_TARGET, API_URL } from "./constants"; // Constants used for API configuration

// Custom hook for fetching data using the Fetch API
export const useFetch = (url, options = {}) => {
  const [response, setResponse] = useState(null); // State for storing the API response
  const [error, setError] = useState(null); // State for storing errors
  const [isLoading, setIsLoading] = useState(false);  //State to track loading status

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const res = await fetch(url, options); // Perform fetch request
        const json = await res.json(); // Parse JSON response
        setResponse(json); // Update response state
        setIsLoading(false);  // Reset loading state

        // Handle HTTP errors
        if (res.status >= 400) {
          setError(`${res.status} - ${res.statusText}`);
        }
      } catch (error) {
        setError(error); // Catch and store any error
      }
    };
    fetchData();
  }, [url]); // Re-run when the `url` changes
  return { response, error, isLoading }; // Return hook values
};

// export const useApiFetch = (url, options) => {
//   return useFetch(API_URL + url, options);
// };

// Custom hook for fetching data from the API, with authentication and custom headers
export const useApiFetch = (url, options) => {
  return useFetch(api.defaults.baseURL + url, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${getUserToken()}`  //Include user token for authentication
    }
  });
};

// Function to retrieve the user token from localStorage
const getUserToken = () => {
  const savedUser = JSON.parse(localStorage.getItem("MernAppUser")); // Parse user data
  return savedUser ? savedUser.token : ""; // Return token or empty string if no user
};

// configure axios api
const api = axios.create({
  //baseURL: `${API_TARGET}/${API_URL}`,
  baseURL: API_URL, // Set base URL for API calls
});

// Set default headers for Axios requests
api.defaults.headers.post["Content-Type"] = "application/json";
api.defaults.headers.common["Authorization"] = getUserToken(); // Include token by default

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  function (config) {
    const token = getUserToken(); // Retrieve token dynamically
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config; // Return the updated configuration
  },
  function (error) {
    return Promise.reject(error); // Handle request errors
  }
);

// Function to set or remove the auth token in Axios headers
export const setAuthToken = (token) => {
  if (token) {
    //applying token
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Add token
  } else {
    //deleting the token from header
    delete api.defaults.headers.common["Authorization"]; // Remove token
  }
};

// Add a response interceptor to handle API errors globally
api.interceptors.response.use(
  function (response) {
    return response; // Return the response for successful requests
  },
  function (error) {
    // Handle specific HTTP error codes
    if (error.response.status === 401 && error.response.data.error) {
      toast.error(error.response.data.error); // Notify unauthorized access
    } else if (error.response.status === 401) {
      toast.error("Unauthorized");
      console.log(error.response.data.error);
    }
    if (error.response.status === 500) {
      toast.error("500 Server Error");
    }
    return Promise.reject(error); // Reject the error for further handling
  }
);

export default api;


