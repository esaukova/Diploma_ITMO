import { useEffect, useState } from "react";
import CalendarUI from "react-calendar";
import "react-calendar/dist/Calendar.css";

import AnalyticsPanel from "../components/AnalyticsPanel";

import {
  Building2,
  Home,
  Ban,
  HeartPulse,
  CalendarDays,
  MapPin,
} from "lucide-react";

import api from "../api/client";
import Navbar from "../components/Navbar";

export default function Calendar() {
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatLocalDate = (dateObj) => {
    return dateObj.toLocaleDateString("sv-SE");
  };

  const loadLogs = async () => {
    try {
      const res = await api.get("/work-log/my");
      setLogs(res.data);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const setStatus = async (status) => {
    setLoading(true);
    setMessage("");

    try {
      const formattedDate =
        formatLocalDate(date);

      await api.post(
        "/work-log/mark",
        null,
        {
          params: {
            work_type: status,
            work_date: formattedDate,
          },
        }
      );

      await loadLogs();

      setMessage(
        `Статус обновлён: ${getStatusText(status)}`
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      console.error(error);

      setMessage(
        "Ошибка обновления статуса"
      );

    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {

      case "OFFICE":
        return "Офис";

      case "REMOTE":
        return "Удаленно";

      case "OFF":
        return "Выходной";

      case "SICK_DAY":
        return "Больничный";

      default:
        return status;
    }
  };

  const getStatus = (dateObj) => {
    const d =
      formatLocalDate(dateObj);

    const log = logs.find(
      (l) => l.work_date === d
    );

    return log?.status;
  };

  const getStatusStyle = (status) => {
    switch (status) {

      case "OFFICE":
        return {
          border: "1px solid #15803d",
          color: "#166534",
          background: "#f0fdf4",
        };

      case "REMOTE":
        return {
          border: "1px solid #2563eb",
          color: "#1d4ed8",
          background: "#eff6ff",
        };

      case "OFF":
        return {
          border: "1px solid #6b7280",
          color: "#374151",
          background: "#f9fafb",
        };

      case "SICK_DAY":
        return {
          border: "1px solid #dc2626",
          color: "#b91c1c",
          background: "#fef2f2",
        };

      default:
        return {
          border: "1px solid #d1d5db",
          color: "#111827",
          background: "white",
        };
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* CALENDAR */}

        <div style={styles.calendarWrapper}>
          <CalendarUI
            onChange={setDate}
            value={date}

            tileClassName={({
              date,
              view,
            }) => {

              if (view !== "month")
                return null;

              const d =
                formatLocalDate(date);

              const log = logs.find(
                (l) =>
                  l.work_date === d
              );

              if (!log)
                return null;

              if (
                log.status === "OFFICE"
              )
                return "office";

              if (
                log.status === "REMOTE"
              )
                return "remote";

              if (
                log.status === "OFF"
              )
                return "off";

              if (
                log.status === "SICK_DAY"
              )
                return "sick";
            }}
          />
        </div>


        {/* ACTIONS PANEL */}

        <div style={styles.actionsPanel}>

          <div style={styles.headerBlock}>

            <CalendarDays
              size={22}
              color="#dc2626"
            />

            <div>
              <div style={styles.title}>
                {date.toLocaleDateString(
                  "ru-RU",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>

              <div style={styles.subtitle}>
                Выберите рабочий статус
              </div>
            </div>
          </div>


          <div style={styles.buttonGroup}>

            <button
              style={{
                ...styles.btn,
                ...styles.officeBtn,
                opacity:
                  loading
                    ? 0.6
                    : 1,
              }}

              onClick={() =>
                setStatus(
                  "OFFICE"
                )
              }

              disabled={loading}
            >
              <Building2 size={18} />
              Офис
            </button>


            <button
              style={{
                ...styles.btn,
                ...styles.remoteBtn,
                opacity:
                  loading
                    ? 0.6
                    : 1,
              }}

              onClick={() =>
                setStatus(
                  "REMOTE"
                )
              }

              disabled={loading}
            >
              <Home size={18} />
              Удаленно
            </button>


            <button
              style={{
                ...styles.btn,
                ...styles.offBtn,
                opacity:
                  loading
                    ? 0.6
                    : 1,
              }}

              onClick={() =>
                setStatus(
                  "OFF"
                )
              }

              disabled={loading}
            >
              <Ban size={18} />
              Выходной
            </button>


            <button
              style={{
                ...styles.btn,
                ...styles.sickBtn,
                opacity:
                  loading
                    ? 0.6
                    : 1,
              }}

              onClick={() =>
                setStatus(
                  "SICK_DAY"
                )
              }

              disabled={loading}
            >
              <HeartPulse size={18} />
              Больничный
            </button>
          </div>

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}
        </div>


        {/* INFO PANEL */}

        <div style={styles.infoPanel}>

          <div style={styles.statusCard}>

            <div style={styles.statusLabel}>
              Текущий статус
            </div>

            <div
              style={{
                ...styles.statusValue,
                ...getStatusStyle(
                  getStatus(date)
                ),
              }}
            >
              {getStatus(date)
                ? getStatusText(
                    getStatus(date)
                  )
                : "Не задан"}
            </div>
          </div>


          <div style={styles.legend}>

            <div style={styles.legendTitle}>
              <MapPin
                size={15}
                color="#dc2626"
              />

              Легенда
            </div>


            <div style={styles.legendItem}>
              <span
                style={{
                  ...styles.legendColor,
                  background:
                    "#16a34a",
                }}
              />

              Офис
            </div>


            <div style={styles.legendItem}>
              <span
                style={{
                  ...styles.legendColor,
                  background:
                    "#2563eb",
                }}
              />

              Удаленно
            </div>


            <div style={styles.legendItem}>
              <span
                style={{
                  ...styles.legendColor,
                  background:
                    "#6b7280",
                }}
              />

              Выходной
            </div>


            <div style={styles.legendItem}>
              <span
                style={{
                  ...styles.legendColor,
                  background:
                    "#dc2626",
                }}
              />

              Больничный
            </div>
          </div>
        </div>


        {/* ANALYTICS */}

        <AnalyticsPanel logs={logs} />

      </div>
    </div>
  );
}

const styles = {

  page: {
    background: "#f5f5f5",
    minHeight: "100vh",
  },

  container: {
    display: "flex",

    gap: "28px",

    justifyContent: "flex-start",

    alignItems: "flex-start",

    flexWrap: "wrap",

    padding: "32px 40px",
  },

  calendarWrapper: {
    background: "white",

    borderRadius: "14px",

    border:
      "1px solid #e5e7eb",

    padding: "24px",

    boxShadow:
      "0 1px 3px rgba(0,0,0,0.06)",
  },

  actionsPanel: {
    width: "320px",

    background: "white",

    borderRadius: "14px",

    border:
      "1px solid #e5e7eb",

    padding: "24px",

    boxShadow:
      "0 1px 3px rgba(0,0,0,0.06)",
  },

  infoPanel: {
    width: "250px",

    background: "white",

    borderRadius: "14px",

    border:
      "1px solid #e5e7eb",

    padding: "24px",

    boxShadow:
      "0 1px 3px rgba(0,0,0,0.06)",
  },

  headerBlock: {
    display: "flex",

    alignItems: "flex-start",

    gap: "12px",

    marginBottom: "28px",
  },

  title: {
    fontSize: "24px",

    fontWeight: "700",

    color: "#111827",

    lineHeight: 1.2,

    textTransform:
      "capitalize",
  },

  subtitle: {
    marginTop: "6px",

    fontSize: "14px",

    color: "#6b7280",
  },

  buttonGroup: {
    display: "flex",

    flexDirection: "column",

    gap: "12px",
  },

  btn: {
    height: "52px",

    borderRadius: "10px",

    cursor: "pointer",

    fontSize: "15px",

    fontWeight: "600",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    transition:
      "all 0.2s ease",

    letterSpacing: "0.2px",

    background: "white",
  },

  officeBtn: {
    background: "#f0fdf4",

    border:
      "1px solid #15803d",

    color: "#166534",
  },

  remoteBtn: {
    background: "#eff6ff",

    border:
      "1px solid #2563eb",

    color: "#1d4ed8",
  },

  offBtn: {
    background: "#f9fafb",

    border:
      "1px solid #6b7280",

    color: "#374151",
  },

  sickBtn: {
    background: "#fef2f2",

    border:
      "1px solid #dc2626",

    color: "#b91c1c",
  },

  statusCard: {
    background: "#fafafa",

    borderRadius: "12px",

    padding: "18px",

    border:
      "1px solid #e5e7eb",

    marginBottom: "24px",
  },

  statusLabel: {
    fontSize: "14px",

    color: "#6b7280",

    marginBottom: "12px",
  },

  statusValue: {
    height: "48px",

    borderRadius: "10px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontWeight: "700",

    fontSize: "16px",
  },

  message: {
    background: "#f0fdf4",

    border:
      "1px solid #bbf7d0",

    color: "#166534",

    padding: "12px",

    borderRadius: "10px",

    marginTop: "24px",

    fontSize: "14px",

    textAlign: "center",
  },

  legend: {
    borderTop:
      "1px solid #e5e7eb",

    paddingTop: "20px",
  },

  legendTitle: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    fontSize: "15px",

    fontWeight: "700",

    marginBottom: "16px",

    color: "#111827",
  },

  legendItem: {
    display: "flex",

    alignItems: "center",

    gap: "10px",

    marginBottom: "12px",

    fontSize: "14px",

    color: "#4b5563",
  },

  legendColor: {
    width: "16px",

    height: "16px",

    borderRadius: "4px",
  },
};