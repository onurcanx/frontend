import React, { useState } from "react";
import axios from "axios";
import "../index.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/forgot-password", { email });
      setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (error) {
      setMessage("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="container">
      <h2>Şifremi Unuttum</h2>
      <p>Lütfen kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı göndereceğiz.</p>
      
      <form onSubmit={handleResetRequest}>
        <input
          type="email"
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Şifre Sıfırlama Bağlantısı Gönder</button>
      </form>

      {message && <p className="message">{message}</p>}

      <a href="/login" className="back-to-login">Giriş sayfasına dön</a>
    </div>
  );
};

export default ForgotPassword;
