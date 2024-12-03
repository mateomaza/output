import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const fetchMovies = (pageNumber) => {
    fetch(`http://127.0.0.1:8000/api/movies/?page=${pageNumber}&per_page=14`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.movies);
        setPage(data.page);
        setTotalPages(data.total_pages);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div>
      <Link className="mr-3" to="/">Go back to feed</Link>
      <Link to="/top-by-year">Data visualization</Link>
      <h1>Top Movies and TV Shows</h1>
      <div className="movies-list">
        {movies.map((movie, index) => (
          <div key={index} className="movie-card">
            <img src={movie.poster_link} alt={movie.series_title} className="movie-poster" />
            <h2>{movie.series_title} ({movie.released_year})</h2>
            <p><strong>Certificate:</strong> {movie.certificate || "N/A"}</p>
            <p><strong>Runtime:</strong> {movie.runtime}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>IMDB Rating:</strong> {movie.imdb_rating}</p>
            <p><strong>Meta Score:</strong> {movie.meta_score || "N/A"}</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Stars:</strong> {movie.star1}, {movie.star2}, {movie.star3}, {movie.star4}</p>
            <p><strong>Votes:</strong> {movie.no_of_votes}</p>
            <p><strong>Gross:</strong> {movie.gross || "N/A"}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevious} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNext} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default MoviesPage;
