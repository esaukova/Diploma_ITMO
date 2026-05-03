import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  const logout = () => {
    if (window.confirm("Вы уверены, что хотите выйти?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const getTitle = () => {
    if (location.pathname === "/dashboard") return "📊 Панель управления";
    if (location.pathname === "/calendar") return "📅 Календарь";
    return "Work Tracker";
  };

  return (
    <div style={styles.nav}>
      <div>
        <h2 style={styles.title}>{getTitle()}</h2>
        {role && <span style={styles.role}>{role === "manager" ? "Менеджер" : "Сотрудник"}</span>}
      </div>
      <button style={styles.btn} onClick={logout}>
        🚪 Выйти
      </button>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "20px",
  },
  role: {
    fontSize: "12px",
    opacity: 0.9,
    marginLeft: "10px",
  },
  btn: {
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "none",
    padding: "8px 20px",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "background 0.3s",
  },
};