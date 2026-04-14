import { useState } from "react";
import { fetchAPI } from "../api/BaseUrl";

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async ({
    url,
    method = "GET",
    body = null,
    headers = {},
  }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAPI(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });

      return data;
    } catch (error) {
      setError(error.message || "Something went wrong!");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, request };
};