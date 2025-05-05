import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"
import axios from "axios";

const API_KEY = "6682424ad5c652959eba926198c09bb8";
const BASE_URL = "https://api.themoviedb.org/3/discover/movie";

const Home = () => {
  const navigate = useNavigate();
  const [randomMovie, setRandomMovie] = useState(null);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        const response = await axios.get(`${BASE_URL}?api_key=${API_KEY}&language=tr-TR&sort_by=popularity.desc`);
        const movies = response.data.results;
        const random = movies[Math.floor(Math.random() * movies.length)];
        setRandomMovie(random);
      } catch (error) {
        setRandomMovie(null);
      }
    };
    fetchRandomMovie();
  }, []);

  return (
    <div className="home-container">
      <h1 className="welcome">Smart Content'e Hoşgeldiniz</h1>
      <h2 className="altbaslik">Ne yapmak istersiniz.</h2>
      <div className="box-container">
        <div className="box" onClick={() => navigate("/movies")}>Popüler Filmler</div>
      </div>

      {/* Günün Filmi Bölümü */}
      {randomMovie && (
        <div className="gunun-filmi-container" onClick={() => navigate(`/movie/${randomMovie.id}`)}>
          <h2 className="gunun-filmi-title">Günün Filmi</h2>
          <div className="gunun-filmi-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`}
              alt={randomMovie.title}
              className="gunun-filmi-poster"
            />
            <div className="gunun-filmi-info">
              <h3>{randomMovie.title}</h3>
              <p>{randomMovie.release_date}</p>
              <p className="gunun-filmi-overview">{randomMovie.overview?.slice(0, 120)}...</p>
              <span className="gunun-filmi-rating">⭐ {randomMovie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
