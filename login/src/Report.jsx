import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { shipments } from "./ShipmentData";
import Navbar from "./Navbar";
import ExportButtons from "./ExportButtons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export const Report = ({ toggleTheme, mode }) => {
  const isDark = mode === "dark";
  const [period, setPeriod] = useState("This Month");
  const [shipmentType, setShipmentType] = useState("All Shipments");

  const today = new Date();

  // Utility functions
  const getStatus = (deliveryTime) => {
    const deliveryDate = new Date(deliveryTime);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    deliveryDate.setHours(0, 0, 0, 0);

    if (deliveryDate < now) return "Overdue";
    if (deliveryDate > now) return "In Transit";
    return "Delivered";
  };

  // === Filtered Data Sets ===
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday

  const weekDeliveries = shipments.filter((s) => {
    const date = new Date(s.time);
    return date >= startOfWeek && date <= endOfWeek;
  });

  const monthDeliveries = shipments.filter((s) => {
    const date = new Date(s.time);
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  });

  const overdueShipments = shipments.filter(
    (s) => new Date(s.time) < new Date()
  );

  // === Chart Data ===
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = days.map((d, i) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const count = shipments.filter((s) => {
        const delivery = new Date(s.time);
        return (
          delivery.getFullYear() === dayDate.getFullYear() &&
          delivery.getMonth() === dayDate.getMonth() &&
          delivery.getDate() === dayDate.getDate()
        );
      }).length;
      return { day: d, deliveries: count };
    });
    return counts;
  }, [shipments]);

  const monthlyData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return months.map((m, i) => {
      const count = shipments.filter((s) => {
        const d = new Date(s.time);
        return d.getMonth() === i;
      }).length;
      return { month: m, deliveries: count };
    });
  }, [shipments]);

  // === Combined data for export ===
  const combinedShipments = [
    ...overdueShipments.map((s) => ({
      ...s,
      status: getStatus(s.time),
      category: "Overdue",
    })),
    ...monthDeliveries.map((s) => ({
      ...s,
      status: getStatus(s.time),
      category: "This Month",
    })),
    ...weekDeliveries.map((s) => ({
      ...s,
      status: getStatus(s.time),
      category: "This Week",
    })),
  ];

  const reportColumns = [
    { label: "Ship ID", field: "id" },
    { label: "Delivery Date", field: "time" },
    { label: "Status", field: "status" },
    { label: "Category", field: "category" },
  ];

  return (

    
    <Box
      sx={{
        paddingLeft: "20px",
        paddingTop: "20px",
        marginLeft: "10px",
        marginBottom: "50px",
        maxWidth: "1300px",
        marginInline: "auto"
      }}
    >
      <h1 style={{marginBottom: 30}}>Shipment Reports</h1>

      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 5, marginBottom: 5, }}>

        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{
            borderRadius: "12px",
            bgcolor: "white",
            minWidth: 160,
            fontWeight: 500,
          }}
        >
          <MenuItem value="This Week">This Week</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="Last Month">Last Month</MenuItem>
          <MenuItem value="Last 3 Months">Last 3 Months</MenuItem>
        </Select>

        <Select
          value={shipmentType}
          onChange={(e) => setShipmentType(e.target.value)}
          sx={{
            borderRadius: "12px",
            bgcolor: "white",
            minWidth: 160,
            fontWeight: 500,
          }}
        >
          <MenuItem value="All Shipments">All Shipments</MenuItem>
          <MenuItem value="Local">Local</MenuItem>
          <MenuItem value="International">International</MenuItem>
        </Select>

        <Box sx={{ marginLeft: "auto" }}>
          <ExportButtons
            data={combinedShipments}
            columns={reportColumns}
            fileName="Shipment Report"
          />
        </Box>
      </Box>


  <Grid container spacing={4} sx={{ mb: 5 }}>

  <Grid item xs={12} md={4}>
    <Card
      sx={{
        borderLeft: "6px solid #d40000ff",
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        p: 2,
        height: 200,
        width: 360
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "#ffe6e6",
          borderRadius: "50%",
          width: 52,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
       
        <CalendarTodayIcon sx={{ color: "#d40000ff" }} />
      </Box>

      <Typography fontWeight="bold" sx={{ color: "#d40000ff" }}>
        Requires immediate attention
      </Typography>
      <Typography variant="h3" color="#d40000ff" sx={{ mt: 1, fontWeight: "bold" }}>
        {overdueShipments.length}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        Overdue shipments
      </Typography>
    </Card>
  </Grid>

  
  <Grid item xs={12} md={4}>
    <Card
      sx={{
        borderLeft: "6px solid #007bff",
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        p: 2,
        height: 200,
        width: 360
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "#cce5ff",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TrendingUpIcon sx={{ color: "#007bff" }} />
      </Box>

      <Typography fontWeight="bold" sx={{ color: "#007bff" }}>
        This Month's Deliveries
      </Typography>
      <Typography variant="h3" color="#007bff" sx={{ mt: 1, fontWeight: "bold" }}>
        {monthDeliveries.length}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={monthDeliveries.length * 10}
        sx={{
          height: 8,
          borderRadius: 5,
          mt: 1.5,
          bgcolor: "#e5e7eb",
          "& .MuiLinearProgress-bar": { bgcolor: "#007bff" },
        }}
      />
      <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
        {monthDeliveries.length * 10}% of monthly target
      </Typography>
    </Card>
  </Grid>


  <Grid item xs={12} md={4}>
    <Card
      sx={{
        borderLeft: "6px solid #ffcc00",
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
        p: 2,
        height: 200,
        width: 360
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "#fff7cc",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TrendingUpIcon sx={{ color: "#b58900" }} />
      </Box>

      <Typography fontWeight="bold" sx={{ color: "#b58900" }}>
        This Week's Deliveries
      </Typography>
      <Typography variant="h3" color="#b58900" sx={{ mt: 1, fontWeight: "bold" }}>
        {weekDeliveries.length}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {weekDeliveries.filter(d => d.date === today).length} deliveries today
      </Typography>
    </Card>
  </Grid>
  <Grid container spacing={4}>
  <Grid item xs={12} md={6}>
    <Card sx={{ borderRadius: 3, p: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", height: 400,
        width: 510}}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        Weekly Shipment Activity
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="deliveries" fill="#ffcc00" radius={[6, 6, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </Grid>

  <Grid item xs={12} md={6}>
    <Card sx={{ borderRadius: 3, p: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", height: 400,
        width: 510 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        Monthly Delivery Trends
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
          type="monotone"
          dataKey="deliveries"
          stroke="#0b1526"             
          strokeWidth={2}
          dot={{ r: 4, fill: "#fff", stroke: "#0b1526", strokeWidth: 2 }} // hollow white circles with dark border
          activeDot={{ r: 6, fill: "#fff", stroke: "#0b1526", strokeWidth: 2 }}
          isAnimationActive={true}
          animationDuration={800}
        />

        </LineChart>
      </ResponsiveContainer>
    </Card>
  </Grid>
</Grid>

</Grid>

    </Box>
  );
};

export default Report;
