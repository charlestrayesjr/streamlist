import { useState } from "react";

function Movies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();

    const cleanSearch = searchTerm.trim();

    if (!cleanSearch) {
      setError("Please enter a movie title.");
      return;
    }

    const token = import.meta.env.VITE_TMDB_TOKEN;

    if (!token) {
      setError("TMDB API token is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url =
        "https://api.themoviedb.org/3/search/movie" +
        `?query=${encodeURIComponent(cleanSearch)}` +
        "&include_adult=false" +
        "&language=en-US" +
        "&page=1";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `TMDB request failed: ${response.status}`
        );
      }

      const data = await response.json();

      setMovies(data.results || []);

      if (!data.results || data.results.length === 0) {
        setError("No movies were found.");
      }
    } catch (err) {
      console.error(err);
      setMovies([]);
      setError("Unable to retrieve movies from TMDB.");
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

        <h2>Find Movie Information</h2>

        <p className="intro">
          Search The Movie Database for movie information,
          ratings, release dates, posters, and descriptions.
        </p>

        <form
          className="movie-search-form"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search for a movie"
          />

          <button type="submit">
            Search
          </button>
        </form>

        {loading && (
          <p className="movie-message">
            Searching...
          </p>
        )}

        {error && (
          <p className="status-message">
            {error}
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
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                />
              ) : (
                <div className="poster-placeholder">
                  No Poster Available
                </div>
              )}

              <div className="movie-card-content">
                <h3>{movie.title}</h3>

                <p className="movie-details">
                  Release Date:{" "}
                  {movie.release_date || "Not available"}
                </p>

                <p className="movie-details">
                  Rating:{" "}
                  {typeof movie.vote_average === "number"
                    ? movie.vote_average.toFixed(1)
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