import { useState, useEffect } from "react";
const API_URL = "http://localhost:3001/api";

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
  }, []);
  return { response, error, isLoading };
};

export const useApiFetch = (url, options) => {
  return useFetch(API_URL + url, options);
};
