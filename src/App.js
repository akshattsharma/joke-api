import React, { useEffect, useRef, useState } from "react";

const API_URL = "https://official-joke-api.appspot.com/random_joke";

// Keep every visible string here so it can be matched to the design images in one place.
const TEXT = {
  title: "Random Joke Generator",
  button: "Fetch joke",
  fetching: "Fetching...",
  retry: "Try again",
  empty: "Click the button to fetch a fresh one.",
  error: "Could not fetch a joke. Try again.",
};

export default function App() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchJoke = async () => {
    if (loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (!data || !data.setup || !data.punchline) throw new Error("Unexpected response");
      if (mounted.current) setJoke({ setup: data.setup, punchline: data.punchline });
    } catch {
      if (mounted.current) {
        setJoke(null);
        setError(true);
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  return (
    <main className="app">
      <h1>{TEXT.title}</h1>

      <div className="card" aria-live="polite">
        {error ? (
          <p className="error">{TEXT.error}</p>
        ) : joke ? (
          <>
            <p className="setup">{joke.setup}</p>
            <p className="punchline">{joke.punchline}</p>
          </>
        ) : (
          <p className="empty">{TEXT.empty}</p>
        )}
      </div>

      <button type="button" className="btn" onClick={fetchJoke} disabled={loading}>
        {loading ? TEXT.fetching : error ? TEXT.retry : TEXT.button}
      </button>
    </main>
  );
}