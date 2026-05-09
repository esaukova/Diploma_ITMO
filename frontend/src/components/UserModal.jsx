export default function UserModal({
  user,
  logs,
  onClose,
}) {

  if (!user) return null;

  const userLogs = logs.filter(
    (l) => l.user_id === user.username
  );

  const office =
    userLogs.filter(
      (l) => l.status === "OFFICE"
    ).length;

  const remote =
    userLogs.filter(
      (l) => l.status === "REMOTE"
    ).length;

  const sick =
    userLogs.filter(
      (l) => l.status === "SICK_DAY"
    ).length;

  const off =
    userLogs.filter(
      (l) => l.status === "OFF"
    ).length;

  return (
    <div style={styles.overlay}>

      <div style={styles.modal}>

        <div style={styles.header}>

          <div>
            <div style={styles.title}>
              {user.full_name}
            </div>

            <div style={styles.subtitle}>
              {user.username}
            </div>
          </div>

          <button
            onClick={onClose}
            style={styles.close}
          >
            ✕
          </button>
        </div>


        <div style={styles.grid}>

          <Card
            title="Офис"
            value={office}
            color="#16a34a"
          />

          <Card
            title="Удаленно"
            value={remote}
            color="#2563eb"
          />

          <Card
            title="Больничный"
            value={sick}
            color="#dc2626"
          />

          <Card
            title="Выходной"
            value={off}
            color="#6b7280"
          />
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}) {

  return (
    <div
      style={{
        background: "white",

        border:
          `1px solid ${color}`,

        borderRadius: "14px",

        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "10px",

          fontSize: "32px",

          fontWeight: "700",

          color: "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const styles = {

  overlay: {
    position: "fixed",

    inset: 0,

    background:
      "rgba(0,0,0,0.4)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 9999,
  },

  modal: {
    width: "800px",

    background: "white",

    borderRadius: "18px",

    padding: "32px",
  },

  header: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: "32px",
  },

  title: {
    fontSize: "28px",

    fontWeight: "700",
  },

  subtitle: {
    marginTop: "6px",

    color: "#6b7280",
  },

  close: {
    border: "none",

    background: "#f3f4f6",

    width: "42px",

    height: "42px",

    borderRadius: "12px",

    cursor: "pointer",
  },

  grid: {
    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "20px",
  },
};