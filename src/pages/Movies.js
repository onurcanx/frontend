import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Movie.css';

const API_KEY = "6682424ad5c652959eba926198c09bb8"; // TMDB API KEY
const BASE_URL = "https://api.themoviedb.org/3/discover/movie";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate(); // Sayfa yönlendirme

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}?api_key=${API_KEY}&language=tr-TR&sort_by=popularity.desc&page=${page}`);
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <div className="movies-container">
      <h2>Popüler Filmler</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card-modern" onClick={() => navigate(`/movie/${movie.id}`)}>
            <div className="movie-poster-container">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster-modern"
              />
              <div className="movie-rating-circle">
                {movie.vote_average ? movie.vote_average.toFixed(0) : "N/A"}
              </div>
            </div>
            <div className="movie-info-modern">
              <h3 className="movie-title-modern">{movie.title}</h3>
              <p className="movie-date-modern">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sayfalama Butonları */}
      <div className="pagination">
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1} className="prev-button">
          ⬅ Önceki
        </button>
        <span className="page-number">Sayfa: {page}</span>
        <button onClick={() => setPage(page + 1)} className="next-button">
          Sonraki ➡
        </button>
      </div>
    </div>
  );
};

export default Movies;
