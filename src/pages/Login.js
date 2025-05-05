import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";


const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        usernameOrEmail,
        password,
      });
  
      console.log("Token:", response.data.token);
      console.log("User ID:", response.data.user_id);
      console.log("Username:", response.data.username); // username geliyor mu kontrol
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("username", response.data.username); // username'i kaydediyoruz
  
      alert("Giriş başarılı!");
      navigate("/");
    } catch (error) {
      alert("Giriş başarısız: " + error.response.data.message);
    }
  };
  

  return (
    <div className="container">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Kullanıcı Adı veya E-posta"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Buton ve Şifremi Unuttum Linki */}
        <div className="button-container">
          <button type="submit">Giriş Yap</button>
          <a href="/forgot-password" className="forgot-password">Şifremi Unuttum</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
