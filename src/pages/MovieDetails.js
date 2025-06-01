import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MovieDetails.css";

const API_KEY = "6682424ad5c652959eba926198c09bb8";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [user_id] = useState(localStorage.getItem("user_id"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    fetchComments();
    checkAdminStatus();
  }, [id]);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/user/${user_id}`
      );
      setIsAdmin(response.data.is_admin);
    } catch (error) {
      console.error("Admin durumu kontrol edilirken hata:", error);
    }
  };

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`
      );
      setMovie(response.data);
    } catch (error) {
      console.error("❌ Film detayları alınırken hata oluştu:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/comments/${id}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("❌ Yorumlar alınırken hata oluştu:", error);
    }
  };

  const analyzeComments = async () => {
    setIsAnalyzing(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/comments/analyze/${id}`
      );
      setAnalysis(response.data);
    } catch (error) {
      console.error("❌ Analiz sırasında hata:", error);
      setError("Yorum analizi sırasında bir hata oluştu.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user_id) {
      setError("Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    if (!newComment.trim()) {
      setError("Yorum boş olamaz.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/comments`,
        {
          movie_id: id,
          comment: newComment,
          user_id: user_id,
        }
      );

      setComments([response.data, ...comments]);
      setNewComment("");
      setError("");
    } catch (error) {
      console.error("❌ Yorum eklenirken hata oluştu:", error);
      setError("Yorum eklenirken bir hata oluştu.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/auth/comments/${commentId}`,
        { data: { user_id: user_id } }
      );

      if (response.data.message === "Yorum başarıyla silindi.") {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      console.error("Yorum silinirken hata oluştu:", error);
      setError("Yorum silinirken bir hata oluştu.");
    }
  };

  if (!movie) {
    return <p>⏳ Yükleniyor...</p>;
  }

  return (
    <div className="movie-details-container">
      <div className="movie-info">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster-large"
        />
        <h2>{movie.title}</h2>
        <p>
          <strong>Puan:</strong> ⭐ {movie.vote_average.toFixed(1)}
        </p>
        <p>
          <strong>Özet:</strong> {movie.overview}
        </p>
        <p>
          <strong>Çıkış Tarihi:</strong> {movie.release_date}
        </p>
      </div>

      <div className="comments-section">
        <div className="comments-header">
          <h3>Yorumlar</h3>
          <button
            onClick={analyzeComments}
            className="analyze-btn"
            disabled={isAnalyzing || comments.length === 0}
          >
            {isAnalyzing ? "Analiz Ediliyor..." : "Yorumları Analiz Et"}
          </button>
        </div>

        {/* Analiz sonuçları */}
        {analysis && analysis.status === "success" && analysis.analysis && (
          <div className="analysis-results">
            <h4>📊 Yorum Analizi</h4>
            <div className="analysis-stats">
              <p>📝 Toplam Yorum: {analysis.analysis.total_comments}</p>
              <p>😊 Pozitif Yorum: {analysis.analysis.positive_comments}</p>
              <p>😞 Negatif Yorum: {analysis.analysis.negative_comments}</p>
              <p>📈 Pozitif Oran: {(analysis.analysis.positive_ratio * 100).toFixed(1)}%</p>
            </div>
            <div className="keywords-section">
              <h5>🔑 Anahtar Kelimeler:</h5>
              <div className="keywords-list">
                {analysis.analysis.keywords.map((kw, index) => (
                  <span key={index} className="keyword-tag">
                    {kw.word} ({kw.count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {analysis && analysis.status === "error" && (
          <div className="error-message">❌ {analysis.message}</div>
        )}

        {analysis && analysis.status === "warning" && (
          <div className="warning-message">⚠️ {analysis.message}</div>
        )}

        {/* Yorum ekleme formu */}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            rows="4"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-comment-btn">
            Yorum Yap
          </button>
        </form>

        {/* Yorumlar listesi */}
        <ul className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <strong>{comment.username || "Bilinmeyen Kullanıcı"}:</strong>{" "}
                {comment.comment}
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="delete-comment-btn"
                  >
                    Sil
                  </button>
                )}
              </li>
            ))
          ) : (
            <p>Henüz yorum yapılmamış.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MovieDetails;
