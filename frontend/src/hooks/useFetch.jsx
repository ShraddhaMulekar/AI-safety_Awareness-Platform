import { useState } from "react";
import { fetchAPI } from "../api/BaseUrl";

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async ({
    url,
    method = "GET",
    body = null,
    data = null,
    headers = {},
  }) => {
    setLoading(true);
    setError(null);

    try {
      const payload = data ?? body;
      const isFormData = payload instanceof FormData;
      const hasContentType = Object.keys(headers).some(
        (key) => key.toLowerCase() === "content-type",
      );

      const requestHeaders = { ...headers };
      if (!isFormData && payload && !hasContentType) {
        requestHeaders["Content-Type"] = "application/json";
      }

      const responseData = await fetchAPI(url, {
        method,
        headers: requestHeaders,
        body: isFormData
          ? payload
          : payload
            ? JSON.stringify(payload)
            : null,
      });

      return responseData;
    } catch (error) {
      setError(error.message || "Something went wrong!");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, request };
};