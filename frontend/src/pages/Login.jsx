import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

import logo from "../assets/logo1.png";

import api from "../api/client";

export default function Login() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response =
        await api.post("/auth/login", null, {
          params: {
            username,
            password,
          },
        });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      if (
        response.data.role === "manager"
      ) {
        navigate("/dashboard");

      } else {
        navigate("/calendar");
      }

    } catch (err) {

      console.error(err);

      setError(
        "Неверный логин или пароль"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* LEFT PANEL */}

      <div style={styles.leftPanel}>

        <div>

          <div style={styles.brandBlock}>

            <img
              src={logo}
              alt="Company logo"
              style={styles.logoImage}
            />

            <div>

              <div style={styles.projectTitle}>
                РЕД МОНИТОР
              </div>

              <div style={styles.projectSubtitle}>
                Система мониторинга сотрудников
              </div>

            </div>
          </div>
        </div>


        <div style={styles.infoBlock}>

          <div style={styles.infoTitle}>
            Контроль удалённой работы
          </div>

          <div style={styles.infoText}>
            Корпоративная система мониторинга
            гибридного формата работы сотрудников.
          </div>

        </div>
      </div>


      {/* RIGHT PANEL */}

      <div style={styles.rightPanel}>

        <form
          onSubmit={handleLogin}
          style={styles.formCard}
        >

          <div style={styles.formHeader}>

            <div style={styles.formTitle}>
              Вход в систему
            </div>

            <div style={styles.formSubtitle}>
              Авторизация через LDAP
            </div>

          </div>


          <div style={styles.inputWrapper}>

            <User
              size={18}
              color="#6b7280"
            />

            <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              style={styles.input}
            />
          </div>


          <div style={styles.inputWrapper}>

            <LockKeyhole
              size={18}
              color="#6b7280"
            />

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={styles.input}
            />
          </div>


          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              "Вход..."
            ) : (
              <>
                Войти
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {

  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f3f4f6",
    fontFamily: "Inter, sans-serif",
  },

  leftPanel: {
    flex: 1,

    background:
      "linear-gradient(135deg, #475569 0%, #64748b 100%)",

    color: "white",

    padding: "80px",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",
  },

  brandBlock: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  logoImage: {
    width: "120px",
    height: "120px",
    objectFit: "contain",
  },

  projectTitle: {
    fontSize: "44px",
    fontWeight: "800",
    lineHeight: 1,
    letterSpacing: "-1px",
  },

  projectSubtitle: {
    marginTop: "10px",
    color: "rgba(255,255,255,0.75)",
    fontSize: "18px",
  },

  infoBlock: {
    maxWidth: "560px",
  },

  infoTitle: {
    fontSize: "46px",
    fontWeight: "800",
    lineHeight: 1.1,
    marginBottom: "24px",
  },

  infoText: {
    fontSize: "20px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.82)",
  },

  rightPanel: {
    width: "520px",

    background: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "40px",

    borderLeft:
      "1px solid #e5e7eb",
  },

  formCard: {
    width: "100%",
    maxWidth: "360px",
  },

  formHeader: {
    marginBottom: "36px",
  },

  formTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "10px",
  },

  formSubtitle: {
    fontSize: "15px",
    color: "#6b7280",
  },

  inputWrapper: {
    height: "58px",

    border:
      "1px solid #d1d5db",

    borderRadius: "14px",

    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "0 16px",

    marginBottom: "18px",

    background: "#ffffff",
  },

  input: {
    flex: 1,
    height: "100%",

    border: "none",

    outline: "none",

    fontSize: "15px",

    color: "#111827",

    background: "transparent",
  },

  button: {
    width: "100%",
    height: "58px",

    border: "none",

    borderRadius: "14px",

    background: "#dc2626",

    color: "white",

    fontSize: "16px",

    fontWeight: "700",

    cursor: "pointer",

    marginTop: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    transition: "all 0.2s ease",
  },

  error: {
    marginTop: "8px",

    background: "#fef2f2",

    border:
      "1px solid #fecaca",

    color: "#b91c1c",

    padding: "14px",

    borderRadius: "12px",

    fontSize: "14px",
  },
};