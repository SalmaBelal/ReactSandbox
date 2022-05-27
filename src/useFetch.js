import { useState, useEffect } from "react";

export function useFetch(uri) {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    if (!uri) return;
    fetch(uri)
      .then((result) => result.json())
      .then(setResponse)
      .then(() => setLoading(false))
      .catch(setError);
  }, [uri]);

  return { loading, response, error };
}
