import { useState } from "react";

const API_URL = "http://localhost:8000";

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await fetch(
        `${API_URL}/auth/login?username=${username}&password=${password}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.access_token) {
        setToken(data.access_token);
      } else {
        alert("Ошибка логина");
      }
    } catch {
      alert("Ошибка подключения");
    }
  };

  const mark = async (type) => {
    await fetch(`${API_URL}/work-log/mark?work_type=${type}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    alert("Отмечено: " + type);
  };

  if (!token) {
    return (
      <div style={styles.modal}>
        <div style={styles.box}>
          <h2>Вход</h2>
          <input
            placeholder="Логин"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <h1>Отметить статус</h1>

      <div style={styles.buttons}>
        <button onClick={() => mark("OFFICE")}>Офис</button>
        <button onClick={() => mark("REMOTE")}>Удалёнка</button>
        <button onClick={() => mark("SICK")}>Больничный</button>
        <button onClick={() => mark("VACATION")}>Отпуск</button>
      </div>
    </div>
  );
}

const styles = {
  modal: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
  },
  box: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  dashboard: {
    textAlign: "center",
    marginTop: "100px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
};

export default App;