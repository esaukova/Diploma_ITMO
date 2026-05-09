import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = {
  OFFICE: "#16a34a",
  REMOTE: "#2563eb",
  OFF: "#6b7280",
  SICK_DAY: "#dc2626",
};

export default function AnalyticsPanel({ logs }) {

  const officeCount =
    logs.filter((l) => l.status === "OFFICE").length;

  const remoteCount =
    logs.filter((l) => l.status === "REMOTE").length;

  const offCount =
    logs.filter((l) => l.status === "OFF").length;

  const sickCount =
    logs.filter((l) => l.status === "SICK_DAY").length;

  const total =
    logs.length || 1;

  const officePercent =
    Math.round((officeCount / total) * 100);

  const data = [
    {
      name: "Офис",
      value: officeCount,
      color: COLORS.OFFICE,
    },

    {
      name: "Удаленно",
      value: remoteCount,
      color: COLORS.REMOTE,
    },

    {
      name: "Выходной",
      value: offCount,
      color: COLORS.OFF,
    },

    {
      name: "Больничный",
      value: sickCount,
      color: COLORS.SICK_DAY,
    },
  ].filter((i) => i.value > 0);

  return (
    <div style={styles.wrapper}>

      <div style={styles.header}>
        Статистика
      </div>

      <div style={styles.chartBlock}>
        <ResponsiveContainer
          width="100%"
          height={260}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div style={styles.centerText}>
          <div style={styles.percent}>
            {officePercent}%
          </div>

          <div style={styles.percentLabel}>
            в офисе
          </div>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.row}>
          <div style={styles.left}>
            <span
              style={{
                ...styles.dot,
                background: COLORS.OFFICE,
              }}
            />
            Офис
          </div>

          <div style={styles.value}>
            {officeCount}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.left}>
            <span
              style={{
                ...styles.dot,
                background: COLORS.REMOTE,
              }}
            />
            Удаленно
          </div>

          <div style={styles.value}>
            {remoteCount}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.left}>
            <span
              style={{
                ...styles.dot,
                background: COLORS.OFF,
              }}
            />
            Выходной
          </div>

          <div style={styles.value}>
            {offCount}
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.left}>
            <span
              style={{
                ...styles.dot,
                background: COLORS.SICK_DAY,
              }}
            />
            Больничный
          </div>

          <div style={styles.value}>
            {sickCount}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "360px",

    background: "white",

    border: "1px solid #e5e7eb",

    borderRadius: "14px",

    padding: "24px",

    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },

  header: {
    fontSize: "22px",

    fontWeight: "700",

    color: "#111827",

    marginBottom: "20px",
  },

  chartBlock: {
    position: "relative",

    height: "260px",
  },

  centerText: {
    position: "absolute",

    top: "50%",
    left: "50%",

    transform: "translate(-50%, -50%)",

    textAlign: "center",
  },

  percent: {
    fontSize: "34px",

    fontWeight: "800",

    color: "#111827",
  },

  percentLabel: {
    marginTop: "4px",

    fontSize: "14px",

    color: "#6b7280",
  },

  stats: {
    marginTop: "16px",
  },

  row: {
    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    padding: "12px 0",

    borderBottom: "1px solid #f3f4f6",
  },

  left: {
    display: "flex",

    alignItems: "center",

    gap: "10px",

    fontSize: "15px",

    color: "#374151",
  },

  value: {
    fontWeight: "700",

    color: "#111827",
  },

  dot: {
    width: "12px",

    height: "12px",

    borderRadius: "50%",
  },
};