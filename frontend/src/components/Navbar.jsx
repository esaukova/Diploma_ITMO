import {
  LogOut,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const role =
    localStorage.getItem("role");

  const isManager =
    role === "manager";

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <header style={styles.header}>

      <div style={styles.left}>

        <div style={styles.logo}>

          {isManager ? (

            <ShieldCheck
              size={20}
              color="#dc2626"
            />

          ) : (

            <CalendarDays
              size={20}
              color="#dc2626"
            />
          )}
        </div>

        <div>

          <div style={styles.title}>

            {isManager
              ? "Панель администратора"
              : "Календарь"}
          </div>

          <div style={styles.subtitle}>

            {isManager
              ? "Менеджер"
              : "Сотрудник"}
          </div>
        </div>
      </div>

      <button
        style={styles.logout}
        onClick={logout}
      >

        <LogOut size={16} />

        Выйти
      </button>
    </header>
  );
}

const styles = {

  header: {
    height: "72px",

    background: "white",

    borderBottom:
      "2px solid #dc2626",

    display: "flex",

    alignItems: "center",

    justifyContent:
      "space-between",

    padding: "0 28px",

    boxShadow:
      "0 1px 2px rgba(0,0,0,0.04)",
  },

  left: {
    display: "flex",

    alignItems: "center",

    gap: "14px",
  },

  logo: {
    width: "38px",

    height: "38px",

    borderRadius: "10px",

    background: "#fef2f2",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },

  title: {
    fontSize: "20px",

    fontWeight: "700",

    color: "#111827",
  },

  subtitle: {
    fontSize: "13px",

    color: "#6b7280",

    marginTop: "2px",
  },

  logout: {
    height: "40px",

    padding: "0 18px",

    borderRadius: "10px",

    border:
      "1px solid #e5e7eb",

    background: "white",

    color: "#374151",

    display: "flex",

    alignItems: "center",

    gap: "8px",

    cursor: "pointer",

    fontSize: "14px",

    fontWeight: "600",

    transition:
      "all 0.2s ease",
  },
};