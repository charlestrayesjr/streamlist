import { useState } from "react";

const TMDB_IMAGE_URL =
  "https://image.tmdb.org/t/p/w500";

function Movies() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [movies, setMovies] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const token =
    import.meta.env.VITE_TMDB_TOKEN;

  const searchMovies = async (
    event
  ) => {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    if (!token) {
      setError(
        "TMDB token is missing. Check your .env file."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            accept:
              "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "TMDB request failed."
        );
      }

      const data =
        await response.json();

      setMovies(data.results || []);
    } catch (requestError) {
      console.error(
        requestError
      );

      setError(
        "Movie search failed. Check your internet connection and TMDB token."
      );
    } finally {
      setLoading(false);
    }
  };

  const addToStreamList = (
    movie
  ) => {
    const storageKey =
      "eztechmovie-streamlist";

    let currentItems = [];

    try {
      const savedItems =
        localStorage.getItem(
          storageKey
        );

      currentItems = savedItems
        ? JSON.parse(savedItems)
        : [];
    } catch {
      currentItems = [];
    }

    const alreadySaved =
      currentItems.some(
        (item) =>
          item.tmdbId === movie.id
      );

    if (alreadySaved) {
      alert(
        "This movie is already in your StreamList."
      );

      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      tmdbId: movie.id,
      title: movie.title,
      notes:
        movie.overview ||
        "Added from TMDB movie search.",
      completed: false,
      createdAt:
        new Date().toLocaleString(),
    };

    localStorage.setItem(
      storageKey,
      JSON.stringify([
        newItem,
        ...currentItems,
      ])
    );

    alert(
      `${movie.title} was added to your StreamList.`
    );
  };

  const addToCart = (movie) => {
    const storageKey =
      "eztechmovie-cart";

    let cart = [];

    try {
      const savedCart =
        localStorage.getItem(
          storageKey
        );

      cart = savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch {
      cart = [];
    }

    const alreadyInCart =
      cart.some(
        (item) =>
          item.id === movie.id
      );

    if (alreadyInCart) {
      alert(
        "This movie is already in your cart."
      );

      return;
    }

    const cartMovie = {
      id: movie.id,
      title: movie.title,
      poster_path:
        movie.poster_path,
      release_date:
        movie.release_date,
      price: 4.99,
    };

    localStorage.setItem(
      storageKey,
      JSON.stringify([
        cartMovie,
        ...cart,
      ])
    );

    alert(
      `${movie.title} was added to your cart.`
    );
  };

  return (
    <section className="page">
      <div className="hero simple-hero">
        <div>
          <p className="eyebrow">
            TMDB Integration
          </p>

          <h2>
            Movie Search
          </h2>

          <p>
            Search current movie
            information using The Movie
            Database API.
          </p>
        </div>
      </div>

      <div className="panel">
        <form
          className="movie-search"
          onSubmit={searchMovies}
        >
          <input
            type="search"
            placeholder="Search for a movie"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : "Search Movies"}
          </button>
        </form>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}
      </div>

      {movies.length === 0 &&
      !loading ? (
        <div className="empty-state">
          <h3>
            Search for a movie
          </h3>

          <p>
            Enter a movie title above to
            retrieve results from TMDB.
          </p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <article
              className="movie-card"
              key={movie.id}
            >
              {movie.poster_path ? (
                <img
                  src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                />
              ) : (
                <div className="poster-placeholder">
                  No Poster
                </div>
              )}

              <div className="movie-details">
                <h3>
                  {movie.title}
                </h3>

                <p className="movie-date">
                  Release:{" "}
                  {movie.release_date ||
                    "Unknown"}
                </p>

                <p className="rating">
                  Rating:{" "}
                  {movie.vote_average
                    ? movie.vote_average.toFixed(
                        1
                      )
                    : "N/A"}
                </p>

                <p className="overview">
                  {movie.overview
                    ? `${movie.overview.slice(
                        0,
                        180
                      )}${
                        movie.overview
                          .length >
                        180
                          ? "..."
                          : ""
                      }`
                    : "No description available."}
                </p>

                <div className="movie-actions">
                  <button
                    className="primary-button"
                    onClick={() =>
                      addToStreamList(
                        movie
                      )
                    }
                  >
                    Add to StreamList
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() =>
                      addToCart(movie)
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Movies;