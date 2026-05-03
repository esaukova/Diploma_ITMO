import { useEffect, useState } from "react";
import CalendarUI from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api/client";
import Navbar from "../components/Navbar";

export default function Calendar() {
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadLogs = () => {
    api.get("/work-log/my").then((res) => setLogs(res.data));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const setStatus = async (status) => {
    setLoading(true);
    setMessage("");
    try {
      await api.post("/work-log/mark", null, {
        params: {
          work_type: status,
          date: date.toISOString().split("T")[0],
        },
      });
      loadLogs();
      setMessage(`Статус успешно обновлен на ${getStatusText(status)}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Ошибка при обновлении статуса");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "OFFICE": return "🏢 Офис";
      case "REMOTE": return "🏠 Удаленно";
      case "OFF": return "❌ Отпуск";
      case "SICK DAY": return "Больничный"
      default: return status;
    }
  };

  const getStatus = (date) => {
    const d = date.toISOString().split("T")[0];
    const log = logs.find((l) => l.work_date === d);
    return log?.status;
  };

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.calendarWrapper}>
          <CalendarUI
            onChange={setDate}
            value={date}
            tileClassName={({ date, view }) => {
              if (view !== 'month') return null;
              const d = date.toISOString().split("T")[0];
              const log = logs.find((l) => l.work_date === d);

              if (!log) return null;

              if (log.status === "OFFICE") return "office";
              if (log.status === "REMOTE") return "remote";
              if (log.status === "OFF") return "off";
              if (log.status === "SICK DAY") return "sick";
            }}
          />
        </div>

        <div style={styles.panel}>
          <h3 style={styles.dateTitle}>
            📅 {date.toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>

          <div style={styles.buttonGroup}>
            <button
                style={{...styles.btnOffice, opacity: loading ? 0.6 : 1}}
                onClick={() => setStatus("OFFICE")}
                disabled={loading}
            >
              🏢 Офис
            </button>
            <button
                style={{...styles.btnRemote, opacity: loading ? 0.6 : 1}}
                onClick={() => setStatus("REMOTE")}
                disabled={loading}
            >
              🏠 Удаленно
            </button>
            <button
                style={{...styles.btnOff, opacity: loading ? 0.6 : 1}}
                onClick={() => setStatus("OFF")}
                disabled={loading}
            >
              ❌ Выходной
            </button>
            <button
                style={{...styles.btnOff, opacity: loading ? 0.6 : 1}}
                onClick={() => setStatus("SICK DAY")}
                disabled={loading}
            >
               Больничный
            </button>
          </div>

          <div style={styles.statusInfo}>
            <div style={styles.statusLabel}>Текущий статус:</div>
            <div style={{
              ...styles.statusValue,
              background: getStatus(date) === "OFFICE" ? "#10b981" :
                         getStatus(date) === "REMOTE" ? "#3b82f6" :
                         getStatus(date) === "SICK DAY" ? "#ff9999" :
                         getStatus(date) === "OFF" ? "#6b7280" : "#e5e7eb",
              color: getStatus(date) ? "white" : "#374151",
            }}>
              {getStatus(date) ? getStatusText(getStatus(date)) : "Не задан"}
            </div>
          </div>

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}

          <div style={styles.legend}>
            <div style={styles.legendTitle}>📌 Легенда:</div>
            <div style={styles.legendItem}>
              <span style={{...styles.legendColor, background: "#86efac"}}></span>
              Офис
            </div>
            <div style={styles.legendItem}>
              <span style={{...styles.legendColor, background: "#93c5fd"}}></span>
              Удаленно
            </div>
            <div style={styles.legendItem}>
              <span style={{...styles.legendColor, background: "#d1d5db"}}></span>
              Выходной
            </div>
            <div style={styles.legendItem}>
              <span style={{...styles.legendColor, background: "#ff9999"}}></span>
              Больничный
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "40px",
    padding: "30px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  calendarWrapper: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  panel: {
    background: "#f9fafb",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    minWidth: "280px",
  },
  dateTitle: {
    margin: "0 0 20px 0",
    color: "#1f2937",
    fontSize: "18px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "25px",
  },
  btnOffice: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  btnRemote: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  btnOff: {
    background: "#6b7280",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  btnSick: {
    background: "#ff9999",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  statusInfo: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  statusLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  statusValue: {
    fontSize: "20px",
    fontWeight: "bold",
    padding: "8px",
    borderRadius: "6px",
    textAlign: "center",
  },
  message: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
  },
  legend: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "15px",
  },
  legendTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#4b5563",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    fontSize: "13px",
    color: "#6b7280",
  },
  legendColor: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
  },
};