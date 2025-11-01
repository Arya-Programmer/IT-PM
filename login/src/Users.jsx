import React, { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import AddUsers from "./AddUsers";

const STATIC_USERS = [
  {
    id: 1,
    name: "Prusha Saleh",
    email: "pm22007@auis.edu.krd",
    role: "UX/UI Designer",
  },
  {
    id: 2,
    name: "Mohamad Rasul",
    email: "mr22038@auis.edu.krd",
    role: "Project Manager",
  },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [users, setUsers] = useState(STATIC_USERS);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("info");

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    []
  );

  const storedRole = (localStorage.getItem("userRole") || "").toLowerCase();
  const isAdmin = storedRole === "admin";

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      Object.values(user).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [users, searchQuery]);

  const handleOpenDialog = () => {
    if (!isAdmin) {
      setStatusMessage("Only administrators can create new users.");
      setStatusType("error");
      return;
    }

    setStatusMessage("");
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => setOpenAddDialog(false);

  const handleAddUser = async (formData) => {
    if (!isAdmin) {
      const error = new Error("Only administrators can create new users.");
      setStatusMessage(error.message);
      setStatusType("error");
      throw error;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      const error = new Error(
        "Your admin session has expired. Please sign in again."
      );
      setStatusMessage(error.message);
      setStatusType("error");
      throw error;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          payload?.message || "Unable to create the user. Please try again.";
        throw new Error(message);
      }

      const createdUser = payload?.user || {};

      setUsers((prev) => [
        ...prev,
        {
          id: createdUser.id || Date.now(),
          name: createdUser.name || formData.name || createdUser.email,
          email: createdUser.email || formData.email,
          role: createdUser.role || formData.role,
        },
      ]);

      const successMessage = `Created user ${
        createdUser.email || formData.email
      } successfully.`;
      setStatusMessage(successMessage);
      setStatusType("success");

      return createdUser;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create user.";
      setStatusMessage(message);
      setStatusType("error");
      throw new Error(message);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
  
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Users Overview
      </h2>

      {statusMessage && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor:
              statusType === "success" ? "#dcfce7" : "#fee2e2",
            color: statusType === "success" ? "#166534" : "#991b1b",
            border:
              statusType === "success"
                ? "1px solid #86efac"
                : "1px solid #fecaca",
          }}
        >
          {statusMessage}
        </div>
      )}

      <div
        style={{ display: "flex", justifyContent: "flex-end", paddingRight: "20px" }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={!isAdmin}
          sx={{
            backgroundColor: "#facc15",
            color: "#000",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "12px",
            padding: "10px 18px",
            opacity: isAdmin ? 1 : 0.6,
            cursor: isAdmin ? "pointer" : "not-allowed",
            "&:hover": {
              backgroundColor: isAdmin ? "#fbbf24" : "#facc15",
            },
          }}
        >
          Add New User
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          border: "2px solid #facc15",
          borderRadius: "30px",
          padding: "6px 14px",
          width: "380px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <SearchIcon style={{ color: "#999", marginRight: "8px" }} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            fontSize: "15px",
            flex: 1,
            color: "#333",
            background: "transparent",
          }}
        />
 
      </div>

      <div style={{ marginBottom: "30px" }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{
                backgroundColor: "white",
                padding: "12px 18px",
                borderRadius: "10px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                marginBottom: "10px",
                borderLeft: "5px solid #facc15",
              }}
            >
              <p style={{ margin: "0", fontWeight: "600" }}>{user.name}</p>
              <p style={{ margin: "2px 0", color: "#555" }}>{user.email}</p>
              <p style={{ margin: "0", color: "#888" }}>{user.role}</p>
            </div>
          ))
        ) : (
          <p style={{ color: "#888" }}>No users found.</p>
        )}
      </div>

      <AddUsers
        open={openAddDialog}
        onClose={handleCloseDialog}
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default Users;
