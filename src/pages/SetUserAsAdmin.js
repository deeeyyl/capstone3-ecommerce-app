import React, { useEffect, useState } from "react";

export default function SetUserAsAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  const handleSetAdmin = (userId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}/set-as-admin`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to set user as admin");
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        // Update local state to reflect the change
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isAdmin: true } : user
          )
        );
      })
      .catch((err) => {
        console.error("Error setting admin:", err);
        alert("Failed to set user as admin.");
      });
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="checkout-card fade-in"  style={{
    width: "100vw",      
    maxWidth: "900px",   
    margin: "40px auto",
    padding: "20px",
  }}>
      <h2 className="checkout-title gradient-text" style={{ marginBottom: "20px" }}>Set User As Admin</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #2c3e50",
                alignItems: "center",
              }}
            >
              <span>
                {user.firstName} {user.lastName} ({user.email}) -{" "}
                {user.isAdmin ? (
                  <strong style={{ color: "#00c6ff" }}>Admin</strong>
                ) : (
                  "User"
                )}
              </span>
              {!user.isAdmin && (
                <button
                  className="custom-success-btn"
                  onClick={() => handleSetAdmin(user._id)}
                >
                  Set as Admin
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}