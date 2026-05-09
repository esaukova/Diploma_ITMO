import { useState } from "react";
import { Search } from "lucide-react";

import api from "../api/client";

export default function UserSearch({
  onSelect,
}) {

  const [query, setQuery] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const searchUsers = async (value) => {

    setQuery(value);

    if (!value) {
      setUsers([]);
      return;
    }

    try {

      const res =
        await api.get(
          "/users/search",
          {
            params: {
              query: value,
            },
          }
        );

      setUsers(res.data);

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={styles.wrapper}>

      <div style={styles.inputWrapper}>

        <Search
          size={18}
          color="#6b7280"
        />

        <input
          value={query}

          onChange={(e) =>
            searchUsers(
              e.target.value
            )
          }

          placeholder="Поиск сотрудника"

          style={styles.input}
        />
      </div>


      {users.length > 0 && (
        <div style={styles.dropdown}>

          {users.map((user) => (

            <div
              key={user.username}

              style={styles.user}

              onClick={() => {
                onSelect(user);

                setUsers([]);
                setQuery("");
              }}
            >
              <div style={styles.name}>
                {user.full_name}
              </div>

              <div style={styles.login}>
                {user.username}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {

  wrapper: {
    position: "relative",
    marginBottom: "28px",
  },

  inputWrapper: {
    height: "52px",

    background: "white",

    border:
      "1px solid #e5e7eb",

    borderRadius: "14px",

    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "0 16px",
  },

  input: {
    border: "none",

    outline: "none",

    width: "100%",

    fontSize: "15px",

    background: "transparent",
  },

  dropdown: {
    position: "absolute",

    top: "60px",

    width: "100%",

    background: "white",

    borderRadius: "14px",

    border:
      "1px solid #e5e7eb",

    overflow: "hidden",

    zIndex: 999,

    boxShadow:
      "0 8px 24px rgba(0,0,0,0.08)",
  },

  user: {
    padding: "14px 16px",

    cursor: "pointer",

    borderBottom:
      "1px solid #f3f4f6",
  },

  name: {
    fontWeight: "600",
    color: "#111827",
  },

  login: {
    marginTop: "4px",

    fontSize: "13px",

    color: "#6b7280",
  },
};