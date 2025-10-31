import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import AddUsers from "./AddUsers";

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const users = [
    { id: 1, name: "Prusha saleh", email: "pm22007@auis.edu.krd", role: "UX/UI Designer"},
    { id: 2, name: "mohamad rasul", email: "mr22038@auis.edu.krd", role: "Project Manager"},

  ];


  const filteredUsers = users.filter((user) =>
    Object.values(user).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleOpenDialog = () => setOpenAddDialog(true);
  const handleCloseDialog = () => setOpenAddDialog(false);

  return (
    <div style={{ padding: "40px" }}>
  
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Users Overview
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "20px"}}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "#facc15",
            color: "#000",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "12px",
            padding: "10px 18px",
            "&:hover": {
              backgroundColor: "#fbbf24",
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

      <AddUsers open={openAddDialog} onClose={handleCloseDialog} />
    </div>
  );
};

export default Users;
