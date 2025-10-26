import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ExportButtons from "./ExportButtons";
import { shipments } from "./ShipmentData";
import ShipmentDialog from "./ShipmentDialog"
import CloseIcon from "@mui/icons-material/Close";

const Shipments = ({ toggleTheme, mode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleOpenDialog = () => setOpenAddDialog(true);
  const handleCloseDialog = () => setOpenAddDialog(false);

  const isDark = mode === "dark";


  const getStatus = (deliveryTime) => {
    if (!deliveryTime) return "Pending";

    const today = new Date();
    const deliveryDate = new Date(deliveryTime);

    today.setHours(0, 0, 0, 0);
    deliveryDate.setHours(0, 0, 0, 0);

    if (deliveryDate.toDateString() === today.toDateString()) return "Docked";
    if (deliveryDate < today) return "Overdue";
    if (deliveryDate > today) return "In Transit";

    return "Pending";
  };


  const shipmentsWithStatus = shipments.map((s) => ({
    ...s,
    status: getStatus(s.time),
  }));

  const q = searchQuery.toLowerCase();
  const filteredShipments = shipmentsWithStatus.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(q) ||
      s.time.toLowerCase().includes(q) ||
      s.mmsi.toLowerCase().includes(q) ||
      s.bol.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "All Status" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  const columns = [
    { field: "mmsi", headerName: "Ship MMSI", width: 200 },
    { field: "bol", headerName: "Ship BOL", width: 220 },
    { field: "id", headerName: "Ship ID", width: 180 },
    { field: "time", headerName: "Estimated Time", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => {
        const status = params.value;
        let color = "";
        switch (status) {
          case "In Transit":
            color = "#2563eb"; 
            break;
          case "Overdue":
            color = "#d20000ff"; 
            break;
          case "Delivered":
            color = "#16a34a"; 
            break;
          case "Docked":
            color = "#d97706"; 
            break;
          case "Pending":
            color = "#6b7280"; 
            break;
          default:
            color = "#6b7280"; 
        }
        return (
          <Chip
            label={status}
            sx={{
              color: color,
              fontWeight: 500,
              background: "transparent",
            }}
          />
        );
      },
    },
  ];

  const shipmentColumns = [
    { label: "Ship MMSI", field: "mmsi" },
    { label: "Ship BOL", field: "bol" },
    { label: "Ship ID", field: "id" },
    { label: "Estimated Time", field: "time" },
    { label: "Status", field: "status" },
  ];


  return (
    <div style={{ paddingLeft: "40px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Shipments Overview
      </h2>

    
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "25px",
        }}
      >
      
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
          }}
        >
          <SearchIcon style={{ color: "#999", marginRight: "8px" }} />
          <input
            type="text"
            placeholder="Search by MMSI, BOL, or Ship ID..."
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

      

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
      
          <Button
            variant="contained"
            startIcon={<AddIcon />}
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
            onClick={handleOpenDialog}
          >
          Add New Shipment
          </Button>
          <ShipmentDialog open={openAddDialog} onClose={handleCloseDialog} />
        </div>
          
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
    
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              fontWeight: 500,
              fontSize: "14px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
            }}
          >
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="In Transit">In Transit</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Docked">Docked</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>

          <ExportButtons
            data={filteredShipments}
            columns={shipmentColumns}
            fileName="Shipments"
          />

          
        </div>
      </div>

  
      <div
        style={{
          height: 500,
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <DataGrid
          rows={filteredShipments}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableColumnMenu
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              fontWeight: 600,
              fontSize: "15px",
            },
            "& .MuiDataGrid-cell": { fontSize: "14px" },
          }}
        />
      </div>
    </div>
  );
};

export default Shipments;
