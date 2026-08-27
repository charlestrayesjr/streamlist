import { useState } from "react";

function Movies() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [movies, setMovies] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSearch = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const cleanSearch = searchTerm.trim();

    if (!cleanSearch) {
      setError(
        "Please enter a movie title."
      );

      setMovies([]);

      return;
    }

    const token =
      import.meta.env.VITE_TMDB_TOKEN;

    if (!token) {
      setError(
        "TMDB API token is missing."
      );

      setMovies([]);

      return;
    }

    setLoading(true);

    setError("");

    setMovies([]);

    try {
      const url =
        "https://api.themoviedb.org/3/search/movie" +
        `?query=${encodeURIComponent(
          cleanSearch
        )}` +
        "&include_adult=false" +
        "&language=en-US" +
        "&page=1";

      const response = await fetch(url, {
        method: "GET",

        headers: {
          accept: "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `TMDB request failed with status ${response.status}`
        );
      }

      const data =
        await response.json();

      const results =
        Array.isArray(data.results)
          ? data.results
          : [];

      setMovies(results);

      if (results.length === 0) {
        setError(
          `No movies were found for "${cleanSearch}".`
        );
      }
    } catch (error) {
      console.error(
        "TMDB search error:",
        error
      );

      setMovies([]);

      setError(
        "Unable to retrieve movies from TMDB. Please try again."
      );
    } finally {
      setLoading(false);
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
            <article
              className="movie-card"
              key={movie.id}
            >
              {movie.poster_path ? (
                <img
                  src={
                    "https://image.tmdb.org/t/p/w500" +
                    movie.poster_path
                  }
                  alt={`${movie.title} poster`}
                  loading="lazy"
                />
              ) : (
                <div
                  className="poster-placeholder"
                  aria-label={
                    `No poster available for ${movie.title}`
                  }
                >
                  No Poster Available
                </div>
              )}

              <div className="movie-card-content">
                <h3>{movie.title}</h3>

                <p className="movie-details">
                  Release Date:{" "}
                  {movie.release_date ||
                    "Not available"}
                </p>

                <p className="movie-details">
                  Rating:{" "}
                  {typeof movie.vote_average ===
                  "number"
                    ? movie.vote_average.toFixed(
                        1
                      )
                    : "N/A"}
                  /10
                </p>

                <p className="movie-overview">
                  {movie.overview ||
                    "No description available."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Movies;