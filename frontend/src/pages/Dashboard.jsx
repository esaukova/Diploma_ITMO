import { useEffect, useMemo, useState } from "react";

import UserSearch from "../components/UserSearch";
import UserModal from "../components/UserModal";

import {
  Users,
  Building2,
  Home,
  Ban,
  HeartPulse,
  ClipboardList,
  Activity,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import api from "../api/client";
import Navbar from "../components/Navbar";

export default function Dashboard() {

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [selectedStatus, setSelectedStatus] =
    useState(null);

  const [logs, setLogs] =
    useState([]);

  const loadLogs = async () => {

    try {

      const res =
        await api.get("/work-log/all");

      setLogs(res.data);

    } catch (e) {

      console.error(e);
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

  useEffect(() => {
    loadLogs();
  }, []);

  const today =
    new Date().toLocaleDateString("sv-SE");

  const todayLogs = useMemo(() => {

    return logs.filter(
      (l) => l.work_date === today
    );

  }, [logs, today]);

  const uniqueUsers = [
    ...new Set(
      logs.map((l) => l.user_id)
    ),
  ];

  const officeCount =
    todayLogs.filter(
      (l) => l.status === "OFFICE"
    ).length;

  const remoteCount =
    todayLogs.filter(
      (l) => l.status === "REMOTE"
    ).length;

  const offCount =
    todayLogs.filter(
      (l) => l.status === "OFF"
    ).length;

  const sickCount =
    todayLogs.filter(
      (l) =>
        l.status === "SICK_DAY"
    ).length;

  const totalLogs = logs.length;

  const attendancePercent =
    todayLogs.length > 0
      ? Math.round(
          (officeCount /
            todayLogs.length) *
            100
        )
      : 0;

  const chartData = [
    {
      name: "Офис",
      value: officeCount,
    },

    {
      name: "Удаленно",
      value: remoteCount,
    },

    {
      name: "Выходной",
      value: offCount,
    },

    {
      name: "Больничный",
      value: sickCount,
    },
  ];

  const COLORS = [
    "#16a34a",
    "#2563eb",
    "#6b7280",
    "#dc2626",
  ];

  return (
    <div style={styles.page}>

      <Navbar
        title="Административная панель"
        subtitle="Система мониторинга сотрудников"
      />

      <div style={styles.wrapper}>

        {/* HEADER */}

        <div style={styles.pageTitle}>

          <TrendingUp
            size={28}
            color="#dc2626"
          />

          <div>

            <div style={styles.subtitle}>
              Мониторинг сотрудников
              и активности
            </div>
          </div>
        </div>


        {/* SEARCH */}

        <UserSearch
          onSelect={(user) =>
            setSelectedUser(user)
          }
        />


        {/* KPI */}

        <div style={styles.cards}>

          <StatCard
            icon={<Users size={28} />}
            title="Сотрудников"
            value={uniqueUsers.length}
            color="#2563eb"
          />

          <StatCard
            icon={<Building2 size={28} />}
            title="В офисе"
            value={officeCount}
            color="#16a34a"
            onClick={() =>
              setSelectedStatus("OFFICE")
            }
          />

          <StatCard
            icon={<Home size={28} />}
            title="Удаленно"
            value={remoteCount}
            color="#2563eb"
            onClick={() =>
              setSelectedStatus("REMOTE")
            }
          />

          <StatCard
            icon={<Ban size={28} />}
            title="Выходной"
            value={offCount}
            color="#6b7280"
            onClick={() =>
              setSelectedStatus("OFF")
            }
          />

          <StatCard
            icon={
              <HeartPulse size={28} />
            }
            title="Больничный"
            value={sickCount}
            color="#dc2626"
            onClick={() =>
              setSelectedStatus("SICK_DAY")
            }
          />

          <StatCard
            icon={
              <ClipboardList size={28} />
            }
            title="Всего записей"
            value={totalLogs}
            color="#f59e0b"
          />
        </div>


        {/* CHARTS */}

        <div style={styles.chartsRow}>

          {/* BAR */}

          <div style={styles.chartCard}>

            <div style={styles.chartHeader}>
              <Activity
                size={18}
                color="#dc2626"
              />

              Статистика за сегодня
            </div>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart data={chartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                >

                  {chartData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>


          {/* PIE */}

          <div style={styles.chartCard}>

            <div style={styles.chartHeader}>
               Распределение
            </div>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >

                  {chartData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div style={styles.centerInfo}>

              <div style={styles.centerPercent}>
                {attendancePercent}%
              </div>

              <div style={styles.centerLabel}>
                в офисе
              </div>
            </div>
          </div>
        </div>


        {/* ACTIVITY */}

        <div style={styles.activityCard}>

          <div style={styles.activityHeader}>
            Последняя активность
          </div>

          {logs
            .slice()
            .reverse()
            .slice(0, 5)
            .map((log, index) => (

              <div
                key={index}
                style={styles.activityRow}
              >

                <div>

                  <div
                    style={
                      styles.activityUser
                    }
                  >
                    {log.user?.username}
                  </div>

                  <div
                    style={
                      styles.activityDate
                    }
                  >
                    {log.work_date}
                  </div>
                </div>

                <StatusBadge
                  status={log.status}
                />
              </div>
            ))}
        </div>


        {/* TABLE */}

        <div style={styles.tableCard}>

          <div style={styles.tableHeader}>
            Сотрудники сегодня
          </div>

          <table style={styles.table}>

            <thead>

              <tr>

                <th style={styles.th}>
                  #
                </th>

                <th style={styles.th}>
                  Сотрудник
                </th>

                <th style={styles.th}>
                  Статус
                </th>

                <th style={styles.th}>
                  Дата
                </th>
              </tr>
            </thead>

            <tbody>

              {todayLogs.map(
                (log, index) => (

                  <tr
                    key={index}
                    style={styles.tr}
                  >

                    <td style={styles.td}>
                      {index + 1}
                    </td>

                    <td style={styles.td}>
                      {log.user?.username}
                    </td>

                    <td style={styles.td}>
                      <StatusBadge
                        status={log.status}
                      />
                    </td>

                    <td style={styles.td}>
                      {log.work_date}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>


        {/* USER MODAL */}

        <UserModal
          user={selectedUser}
          logs={logs}
          onClose={() =>
            setSelectedUser(null)
          }
        />


        {/* STATUS MODAL */}

        {selectedStatus && (

          <div style={styles.modalOverlay}>

            <div style={styles.statusModal}>

              <div style={styles.modalHeader}>

                Сотрудники со статусом

                {" "}

                <span style={{ color: "#000000" }}>
                  {getStatusText(selectedStatus)}
                </span>
              </div>

              {todayLogs
                .filter(
                  (l) =>
                    l.status ===
                    selectedStatus
                )
                .map((log, index) => (

                  <div
                    key={index}
                    style={styles.userRow}
                  >
                    {log.user?.username}
                  </div>
                ))}

              <button
                style={styles.closeBtn}
                onClick={() =>
                  setSelectedStatus(null)
                }
              >
                Закрыть
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* STATUS BADGE */

function StatusBadge({ status }) {

  const map = {

    OFFICE: {
      text: "Офис",
      bg: "#dcfce7",
      color: "#166534",
    },

    REMOTE: {
      text: "Удаленно",
      bg: "#dbeafe",
      color: "#1d4ed8",
    },

    OFF: {
      text: "Выходной",
      bg: "#f3f4f6",
      color: "#374151",
    },

    SICK_DAY: {
      text: "Больничный",
      bg: "#fee2e2",
      color: "#b91c1c",
    },
  };

  const current =
    map[status] || map.OFF;


  return (
    <div
      style={{
        background: current.bg,
        color: current.color,

        padding: "6px 12px",

        borderRadius: "999px",

        fontSize: "13px",

        fontWeight: "600",

        display: "inline-flex",
      }}
    >
      {current.text}
    </div>
  );
}


/* KPI */

function StatCard({
  icon,
  title,
  value,
  color,
  onClick,
}) {

  return (
    <div
      style={{
        ...styles.statCard,
        cursor: onClick
          ? "pointer"
          : "default",
        transition: "0.2s",
      }}
      onClick={onClick}
    >

      <div
        style={{
          ...styles.iconBox,
          background:
            `${color}15`,
        }}
      >

        <div style={{ color }}>
          {icon}
        </div>
      </div>

      <div style={styles.statValue}>
        {value}
      </div>

      <div style={styles.statTitle}>
        {title}
      </div>
    </div>
  );
}


/* STYLES */

const styles = {

  page: {
    background: "#f5f5f5",
    minHeight: "100vh",
  },

  wrapper: {
    padding: "32px",
  },

  pageTitle: {
    display: "flex",
    alignItems: "center",
    gap: "16px",

    marginBottom: "24px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: "4px",
    color: "#6b7280",
    fontSize: "14px",
  },

  cards: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",

    gap: "20px",

    marginBottom: "28px",
  },

  statCard: {
    background: "white",

    borderRadius: "16px",

    padding: "24px",

    border:
      "1px solid #e5e7eb",

    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05)",
  },

  iconBox: {
    width: "52px",
    height: "52px",

    borderRadius: "14px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: "18px",
  },

  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
  },

  statTitle: {
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "14px",
  },

  chartsRow: {
    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "24px",

    marginBottom: "28px",
  },

  chartCard: {
    background: "white",

    borderRadius: "16px",

    border:
      "1px solid #e5e7eb",

    padding: "24px",

    position: "relative",

    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05)",
  },

  chartHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",

    fontSize: "18px",
    fontWeight: "700",

    marginBottom: "20px",

    color: "#111827",
  },

  centerInfo: {
    position: "absolute",

    top: "52%",
    left: "50%",

    transform:
      "translate(-50%, -50%)",

    textAlign: "center",
  },

  centerPercent: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
  },

  centerLabel: {
    marginTop: "4px",
    color: "#6b7280",
    fontSize: "14px",
  },

  activityCard: {
    background: "white",

    borderRadius: "16px",

    border:
      "1px solid #e5e7eb",

    padding: "24px",

    marginBottom: "28px",

    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05)",
  },

  activityHeader: {
    fontSize: "20px",
    fontWeight: "700",

    marginBottom: "20px",

    color: "#111827",
  },

  activityRow: {
    display: "flex",

    alignItems: "center",

    justifyContent:
      "space-between",

    padding: "16px 0",

    borderBottom:
      "1px solid #f3f4f6",
  },

  activityUser: {
    fontWeight: "600",
    color: "#111827",
  },

  activityDate: {
    marginTop: "4px",

    color: "#6b7280",

    fontSize: "13px",
  },

  tableCard: {
    background: "white",

    borderRadius: "16px",

    border:
      "1px solid #e5e7eb",

    overflow: "hidden",

    boxShadow:
      "0 1px 3px rgba(0,0,0,0.05)",
  },

  tableHeader: {
    padding: "24px",

    borderBottom:
      "1px solid #e5e7eb",

    fontSize: "20px",
    fontWeight: "700",

    color: "#111827",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",

    padding: "16px 24px",

    background: "#fafafa",

    fontSize: "13px",

    fontWeight: "700",

    color: "#6b7280",

    textTransform: "uppercase",
  },

  tr: {
    borderBottom:
      "1px solid #f3f4f6",
  },

  td: {
    padding: "18px 24px",

    color: "#111827",

    fontSize: "14px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,

    background:
      "rgba(0,0,0,0.45)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 1000,
  },

  statusModal: {
    width: "420px",

    background: "white",

    borderRadius: "18px",

    padding: "28px",

    boxShadow:
      "0 20px 50px rgba(0,0,0,0.18)",
  },

  modalHeader: {
    fontSize: "24px",

    fontWeight: "700",

    marginBottom: "24px",

    color: "#111827",
  },

  userRow: {
    padding: "14px 16px",

    border:
      "1px solid #e5e7eb",

    borderRadius: "12px",

    marginBottom: "12px",

    fontWeight: "600",

    background: "#fafafa",

    color: "#111827",
  },

  closeBtn: {
    width: "100%",

    height: "48px",

    border: "none",

    borderRadius: "12px",

    background: "#dc2626",

    color: "white",

    fontWeight: "700",

    cursor: "pointer",

    marginTop: "18px",
  },
};