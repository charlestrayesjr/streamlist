async function searchMovies(query, signal) {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (!token) {
    throw new Error("TMDB API token is missing.");
  }

  const url =
    "https://api.themoviedb.org/3/search/movie" +
    `?query=${encodeURIComponent(query)}` +
    "&include_adult=false" +
    "&language=en-US" +
    "&page=1";

  const response = await fetch(url, {
    method: "GET",
    signal,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  return Array.isArray(data.results) ? data.results : [];
}

export { searchMovies };
