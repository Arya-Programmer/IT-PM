// Dashboard.jsx
import React, { useState } from "react";
import ShipmentTable from "./Shipments";
import ExportButtons from "./ExportButtons";
import Shipments from "./Shipments";

const Dashboard = ({ toggleTheme, mode }) => {
  

  return (
    <div >
      <Shipments  />
    </div>
  );
};

export default Dashboard;