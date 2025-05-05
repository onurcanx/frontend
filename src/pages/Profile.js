import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';

const API_KEY = "6682424ad5c652959eba926198c09bb8"; // TMDB API KEY

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchUserData(userId);
    fetchUserComments(userId);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + `/auth/user/${userId}`);
      if (response.data) {
        setUserData(response.data);
      } else {
        setError("Kullanıcı bilgileri alınamadı.");
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
      setError("Kullanıcı bilgileri alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserComments = async (userId) => {
    try {
      console.log(`Kullanıcı yorumları alınıyor (ID: ${userId})...`);
      const response = await axios.get(process.env.REACT_APP_API_URL + `/auth/user/${userId}/comments`);
      
      if (!response.data) {
        throw new Error("Yorumlar alınamadı");
      }
      
      console.log(`${response.data.length} yorum bulundu`);
      const commentsWithMovies = await Promise.all(
        response.data.map(async (comment) => {
          try {
            const movieDetails = await fetchMovieDetails(comment.movie_id);
            return {
              ...comment,
              movie: movieDetails
            };
          } catch (error) {
            console.error(`Film bilgisi alınamadı (ID: ${comment.movie_id}):`, error);
            return {
              ...comment,
              movie: {
                title: "Film bilgisi alınamadı",
                poster_path: null,
                release_date: null,
                error: true,
                errorMessage: error.message
              }
            };
          }
        })
      );
      setUserComments(commentsWithMovies);
    } catch (error) {
      console.error("Yorumlar alınırken hata oluştu:", error);
      setError("Yorumlar alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      console.log(`Film bilgisi alınıyor (ID: ${movieId})...`);
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=tr-TR`
      );
      
      if (!response.data) {
        throw new Error("Film bilgisi alınamadı");
      }
      
      console.log(`Film bilgisi başarıyla alındı: ${response.data.title}`);
      return response.data;
    } catch (error) {
      console.error(`Film bilgisi alınırken hata (ID: ${movieId}):`, error);
      if (error.response) {
        console.error('Hata detayları:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate("/")} className="home-button">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profil Bilgileri</h1>
        <button onClick={handleLogout} className="logout-btn">
          Çıkış Yap
        </button>
      </div>

      <div className="profile-info">
        <div className="info-card">
          <h2>Kişisel Bilgiler</h2>
          <div className="info-item">
            <span className="label">Kullanıcı Adı:</span>
            <span className="value">{userData?.username}</span>
          </div>
          <div className="info-item">
            <span className="label">E-posta:</span>
            <span className="value">{userData?.email}</span>
          </div>
        </div>

        <div className="comments-section">
          <h2>Yorumlarım</h2>
          {userComments.length > 0 ? (
            <div className="comments-list">
              {userComments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="movie-info">
                    {comment.movie?.poster_path && (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${comment.movie.poster_path}`} 
                        alt={comment.movie.title}
                        className="movie-poster"
                      />
                    )}
                    <div>
                      <span className="movie-title">
                        {comment.movie?.title || "Film bilgisi yok"}
                      </span>
                      {comment.movie?.release_date && (
                        <span className="movie-year">
                          ({new Date(comment.movie.release_date).getFullYear()})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="comment-content">
                    <span className="comment-text">{comment.comment}</span>
                    <span className="comment-date-left">
                      {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-comments">Henüz yorum yapmamışsınız.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 
