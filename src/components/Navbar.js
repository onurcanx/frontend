import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>SmartContent</h1>

      {/* Ortadaki Linkler */}
      <div style={styles.centerNav}>
        <button
          style={{
            ...styles.textLink,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            margin: 0,
            display: 'inline',
            verticalAlign: 'middle',
            lineHeight: 'normal',
            height: 'auto'
          }}
          onClick={() => window.location.href = '/'}
        >
          Anasayfa
        </button>
        <Link to="/movies" style={styles.textLink}>
          Filmler
        </Link>
      </div>

      {/* Sağ üstte giriş/çıkış butonları */}
      <div style={styles.navLinks}>
        {token ? (
          <>
            <Link to="/profile" style={styles.usernameLink}>
              <span style={styles.username}>{username}</span>
            </Link>
            <button onClick={handleLogout} style={styles.button}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.textLink}>
              Giriş Yap
            </Link>
            <Link to="/register" style={styles.textLink}>
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#00304d", // color2
    color: "white",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "white"
  },
  centerNav: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1, // Ortadaki linkleri ortalamak için
    gap: "30px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  textLink: {
    color: "#00f0ff", // color5
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
  },
  usernameLink: {
    textDecoration: "none",
  },
  username: {
    color: "#00f0ff",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#006699", // color3
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Navbar;
