function MovieCard({ movie }) {
  return (
    <article className="movie-card">
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
          aria-label={`No poster available for ${movie.title}`}
        >
          No Poster Available
        </div>
      )}

      <div className="movie-card-content">
        <h3>{movie.title}</h3>

        <p className="movie-details">
          Release Date: {movie.release_date || "Not available"}
        </p>

        <p className="movie-details">
          Rating:{" "}
          {typeof movie.vote_average === "number"
            ? movie.vote_average.toFixed(1)
            : "N/A"}
          /10
        </p>

        <p className="movie-overview">
          {movie.overview || "No description available."}
        </p>
      </div>
    </article>
  );
}

export default MovieCard;
