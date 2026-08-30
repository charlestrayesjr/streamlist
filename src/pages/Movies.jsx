import { useEffect, useRef, useState } from "react";

import MovieCard from "../components/MovieCard.jsx";
import { searchMovies } from "../services/tmdb.js";

function Movies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const cleanSearch = searchTerm.trim();

    if (!cleanSearch) {
      setError("Please enter a movie title.");
      setMovies([]);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const results = await searchMovies(
        cleanSearch,
        controller.signal
      );

      setMovies(results);

      if (results.length === 0) {
        setError(
          `No movies were found for "${cleanSearch}".`
        );
      }
    } catch (caught) {
      if (caught.name === "AbortError") {
        return;
      }

      console.error("TMDB search error:", caught);
      setMovies([]);
      setError(
        "Unable to retrieve movies from TMDB. Please try again."
      );
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <main className="page">
      <section className="movie-page">
        <p className="eyebrow">
          TMDB MOVIE SEARCH
        </p>

        <h2>
          Find Movie Information
        </h2>

        <p className="intro">
          Search The Movie Database for
          movie information, ratings,
          release dates, posters, and
          descriptions.
        </p>

        <form
          className="movie-search-form"
          onSubmit={handleSearch}
        >
          <label
            htmlFor="movie-search"
            className="search-label"
          >
            Movie title
          </label>

          <div className="movie-search-controls">
            <input
              id="movie-search"
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search for a movie"
              disabled={loading}
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <p
            className="status-message"
            role="alert"
          >
            {error}
          </p>
        )}

        {!loading &&
          movies.length > 0 && (
            <p
              className="results-message"
              aria-live="polite"
            >
              Showing {movies.length} result
              {movies.length === 1
                ? ""
                : "s"}.
            </p>
          )}

        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Movies;