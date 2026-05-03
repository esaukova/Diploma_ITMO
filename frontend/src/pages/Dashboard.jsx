import { useEffect, useState } from "react";
import api from "../api/client";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allLogs, setAllLogs] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/work-log/all"),
      api.get("/work-log/my")
    ]).then(([allRes, myRes]) => {
      setLogs(allRes.data);
      setAllLogs(myRes.data);
      setLoading(false);
    }).catch(err => {
      console.error("Error loading data:", err);
      setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter((l) => l.work_date === today);

  const stats = {
    OFFICE: todayLogs.filter((l) => l.status === "OFFICE").length,
    REMOTE: todayLogs.filter((l) => l.status === "REMOTE").length,
    OFF: todayLogs.filter((l) => l.status === "OFF").length,
    SICK: todayLogs.filter((l) => l.status === "SICK DAY").length,
  };

  const chartData = [
    { status: "OFFICE", count: stats.OFFICE, color: "#10b981" },
    { status: "REMOTE", count: stats.REMOTE, color: "#3b82f6" },
    { status: "OFF", count: stats.OFF, color: "#6b7280" },
  ];

  const pieData = chartData.filter(d => d.count > 0);

  const uniqueUsers = [...new Set(logs.map(l => l.user_id))];
  const totalEntries = logs.length;

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.loading}>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: 30 }}>
        <h2 style={styles.header}>📊 Панель управления</h2>

        {/* KPI Cards */}
        <div style={styles.kpiGrid}>
          <div style={{...styles.card, background: "#e0f2fe"}}>
            <div style={styles.cardIcon}>👥</div>
            <div style={styles.cardValue}>{uniqueUsers.length}</div>
            <div style={styles.cardLabel}>Пользователей</div>
          </div>

          <div style={{...styles.card, background: "#d1fae5"}}>
            <div style={styles.cardIcon}>🏢</div>
            <div style={styles.cardValue}>{stats.OFFICE}</div>
            <div style={styles.cardLabel}>В офисе</div>
          </div>

          <div style={{...styles.card, background: "#dbeafe"}}>
            <div style={styles.cardIcon}>🏠</div>
            <div style={styles.cardValue}>{stats.REMOTE}</div>
            <div style={styles.cardLabel}>Удаленно</div>
          </div>

          <div style={{...styles.card, background: "#f3f4f6"}}>
            <div style={styles.cardIcon}>❌</div>
            <div style={styles.cardValue}>{stats.OFF}</div>
            <div style={styles.cardLabel}>Выходной</div>
          </div>

          <div style={{...styles.card, background: "#fef3c7"}}>
            <div style={styles.cardIcon}>📝</div>
            <div style={styles.cardValue}>{totalEntries}</div>
            <div style={styles.cardLabel}>Всего записей</div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={styles.chartsSection}>
          <div style={styles.chartCard}>
            <h3>📊 Статистика за сегодня</h3>
            <BarChart width={400} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </div>

          {pieData.length > 0 && (
            <div style={styles.chartCard}>
              <h3>🥧 Распределение</h3>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          )}
        </div>

        {/* Users Table */}
        <h3 style={styles.sectionTitle}>👤 Сотрудники сегодня</h3>

        {todayLogs.length === 0 ? (
          <div style={styles.emptyState}>Нет данных за сегодня</div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.th}>#</div>
              <div style={styles.th}>ID сотрудника</div>
              <div style={styles.th}>Статус</div>
              <div style={styles.th}>Дата</div>
            </div>
            {todayLogs.map((l, i) => (
              <div key={i} style={styles.tableRow}>
                <div style={styles.td}>{i + 1}</div>
                <div style={styles.td}>{l.user_id}</div>
                <div style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    background: l.status === "OFFICE" ? "#10b981" :
                               l.status === "REMOTE" ? "#3b82f6" : "#6b7280"
                  }}>
                    {l.status === "OFFICE" ? "🏢 Офис" :
                     l.status === "REMOTE" ? "🏠 Удаленно" : "❌ Выходной"}
                  </span>
                </div>
                <div style={styles.td}>{l.work_date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#666",
  },
  header: {
    marginBottom: "30px",
    color: "#1f2937",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  cardIcon: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  cardLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "5px",
  },
  chartsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "30px",
    marginBottom: "40px",
  },
  chartCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    margin: "30px 0 20px 0",
    color: "#1f2937",
  },
  table: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "60px 1fr 1fr 1fr",
    background: "#f3f4f6",
    padding: "12px 16px",
    fontWeight: "bold",
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    color: "#374151",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "60px 1fr 1fr 1fr",
    padding: "12px 16px",
    borderBottom: "1px solid #f3f4f6",
    transition: "background 0.2s",
  },
  td: {
    color: "#4b5563",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    background: "#f9fafb",
    borderRadius: "12px",
    color: "#6b7280",
  },
};