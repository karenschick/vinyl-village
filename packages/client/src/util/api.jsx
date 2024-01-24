import { useState, useEffect } from "react";
// const API_URL = "http://localhost:3001/api";
import axios from "axios";
import { toast } from "react-toastify";
import { API_TARGET, API_URL } from "./constants";
export const useFetch = (url, options = {}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        setResponse(json);
        setIsLoading(false);
        if (res.status >= 400) {
          setError(`${res.status} - ${res.statusText}`);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [url]);
  return { response, error, isLoading };
};

export const useApiFetch = (url, options) => {
  return useFetch(API_URL + url, options);
};

const getUserToken = () => {
  const savedUser = JSON.parse(localStorage.getItem("MernAppUser"));
  return savedUser ? savedUser.token : "";
};

// configure axios api
const api = axios.create({
  //baseURL: `${API_TARGET}/${API_URL}`,
  baseURL: API_URL,
});

api.defaults.headers.post["Content-Type"] = "application/json";
api.defaults.headers.common["Authorization"] = getUserToken();

api.interceptors.request.use(
  function (config) {
    const token = getUserToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export const setAuthToken = (token) => {
  if (token) {
    //applying token
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    //deleting the token from header
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401 && error.response.data.error) {
      toast.error(error.response.data.error);
    } else if (error.response.status === 401) {
      toast.error("Unauthorized");
      console.log(error.response.data.error);
    }
    if (error.response.status === 500) {
      toast.error("500 Server Error");
    }
    return Promise.reject(error);
  }
);

export default api;


