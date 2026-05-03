import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "manager") navigate("/dashboard");
    if (token && role === "worker") navigate("/calendar");
  }, [navigate]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Заполните все поля");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", null, {
        params: { username, password },
      });

      const token = res.data.access_token;
      const role = res.data.role;

      if (!token || !role) {
        throw new Error("Неверный ответ сервера");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "manager") navigate("/dashboard");
      else navigate("/calendar");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.detail || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Треккер удаленки</h2>
        <p style={styles.subtitle}>Войдите в систему</p>

        <input
          type="text"
          placeholder="Имя пользователя"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Пароль"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <button
          style={{...styles.button, opacity: loading ? 0.6 : 1}}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  card: {
    padding: "40px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    textAlign: "center",
    minWidth: "300px",
  },
  title: {
    margin: "0 0 10px 0",
    color: "#333",
  },
  subtitle: {
    margin: "0 0 30px 0",
    color: "#666",
    fontSize: "14px",
  },
  input: {
    display: "block",
    margin: "15px auto",
    padding: "12px",
    width: "250px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "12px 30px",
    marginTop: "20px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    background: "#667eea",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
};