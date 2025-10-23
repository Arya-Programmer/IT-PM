import React from 'react'
import Navbar from './Navbar'
import { shipments } from "./ShipmentData"; 
import { DarkMode } from '@mui/icons-material';
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExportButtons from "./ExportButtons";

export const Report = ({toggleTheme, mode}) => {
  const isDark = mode === "dark";
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); //sunday

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay())); //saturday

  const week_delivery = shipments.filter((s) => {
    const deliveryDate = new Date(s.time);
    return !isNaN(deliveryDate) && deliveryDate >= startOfWeek && deliveryDate <= endOfWeek;
  });
  
  const currentMonth = today.getMonth(); 
  const currentYear = today.getFullYear();
  const month_delivery = shipments.filter((s) => {
    const deliveryDate = new Date(s.time);
    return !isNaN(deliveryDate) &&
     deliveryDate.getMonth() == currentMonth && 
     deliveryDate.getFullYear() == currentYear;
  });

  const getStatus = (deliveryTime) => {
  const today = new Date();
  const deliveryDate = new Date(deliveryTime);

  today.setHours(0, 0, 0, 0);
  deliveryDate.setHours(0, 0, 0, 0);

  if (deliveryDate < today) return "Overdue";
  if (deliveryDate > today) return "In Transit";
  return "Delivered";
};

const overdue_shipments = shipments.filter((s) => {
  const deliveryDate = new Date(s.time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deliveryDate.setHours(0, 0, 0, 0);
  return !isNaN(deliveryDate) && deliveryDate < today;
});

const exportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Shipment Report", 14, 20);

  const formatData = (title, data) => {
    doc.text(title, 14, doc.lastAutoTable?.finalY + 10 || 30);
    doc.autoTable({
      startY: doc.lastAutoTable?.finalY + 15 || 35,
      head: [["ID", "Delivery Date", "Status"]],
      body: data.map((s) => [s.id, s.time, getStatus(s.time)]),
    });
  };

  formatData("Overdue Shipments", overdue_shipments);
  formatData("This Month's Deliveries", month_delivery);
  formatData("This Week's Deliveries", week_delivery);

  doc.save("shipment-report.pdf");
};

const exportExcel = () => {
  const sheetData = [];

  const pushSection = (title, data) => {
    sheetData.push([title]);
    sheetData.push(["ID", "Delivery Date", "Status"]);
    data.forEach((s) => {
      sheetData.push([s.id, s.time, getStatus(s.time)]);
    });
    sheetData.push([]);
  };

  pushSection("Overdue Shipments", overdue_shipments);
  pushSection("This Month's Deliveries", month_delivery);
  pushSection("This Week's Deliveries", week_delivery);

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, "shipment-report.xlsx");
  };

  const reportColumns = [
    { label: "Ship ID", field: "id" },
    { label: "Delivery Date", field: "time" },
    { label: "Status", field: "status" },
    { label: "Category", field: "category" },
  ];

  const combinedShipments = [
    ...overdue_shipments.map(s => ({ ...s, status: getStatus(s.time), category: "Overdue" })),
    ...month_delivery.map(s => ({ ...s, status: getStatus(s.time), category: "This Month" })),
    ...week_delivery.map(s => ({ ...s, status: getStatus(s.time), category: "This Week" })),
  ];

  return (
    <div style={{
      paddingLeft: "50px",
      paddingTop: "10px",
      overflowY: "auto",
      marginTop: "150px",
      marginLeft: "40px",
      marginBottom: "50px",
      
    }}><Navbar current="report" toggleTheme={toggleTheme} mode={mode}/>

    <div style={{ display: "flex", marginLeft: "-10px"}}>
      <ExportButtons data={combinedShipments} columns={reportColumns} fileName="Report" />
     
    </div>
    

    <h2 style={{
        fontSize: "20px",
        color: isDark ? "#80bfff" : "#00008B",
        marginTop: "20px",
        
      }}>Overdue shipments</h2>
      <h3 style={{
        fontSize: "15px",
        color: isDark? "white" : "#333",
        paddingTop: "10px",
        paddingLeft: "10px",
        
      }}>Shipments: {overdue_shipments.length}</h3>
      <ul style={{
        paddingTop: "10px", 
        paddingLeft: "25px", 
        color: isDark ? "#f15f48ff" : "#d40000ff",
        
        }}>
        {overdue_shipments.map((s) => (
          <li key={s.id}>
            Ship ID: {s.id} — Delivery Date: {s.time}   Status: {getStatus(s.time)}
          </li>
        ))}
      </ul>

    <h2 style={{
        fontSize: "20px",
        color: isDark ? "#80bfff" : "#00008B",
        marginTop: "30px"
        
      }}>This month's deliveries</h2>
      <h3 style={{
        fontSize: "15px",
        color: isDark? "white" : "#333",
        paddingTop: "10px",
        paddingLeft: "10px"
      }}>Shipments: {month_delivery.length}</h3>
      <ul style={{ paddingTop: "10px", paddingLeft: "25px" }}>
  {month_delivery.map((s) => {
    const status = getStatus(s.time);
    const isOverdue = status === "Overdue";

    return (
      <li
        key={s.id}
        style={{
          color: isOverdue
            ? isDark
              ? "#f15f48ff"
              :  "#d40000ff"
            : isDark
            ? "white"
            : "black",
        }}
      >
        Ship ID: {s.id} — Delivery Date: {s.time} — Status: {status}
      </li>
    );
  })}
</ul>


      <h2 style={{
        fontSize: "20px",
        color: isDark ? "#80bfff" : "#00008B",
        marginTop: "30px"
      }}>This week's deliveries</h2>
      <h3 style={{
        fontSize: "15px",
        color: isDark? "white" : "#333",
        paddingTop: "10px",
        paddingLeft: "10px",
        
      }}>Shipments: {week_delivery.length}</h3>
      <ul style={{ paddingTop: "10px", paddingLeft: "25px" }}>
    {week_delivery.map((s) => {
    const status = getStatus(s.time);
    const isOverdue = status === "Overdue";

    return (
      <li
        key={s.id}
        style={{
          color: isOverdue
            ? isDark
              ? "#f15f48ff"
              :  "#d40000ff"
            : isDark
            ? "white"
            : "black",
        }}
      >
        Ship ID: {s.id} — Delivery Date: {s.time} — Status: {status}
      </li>
    );
  })}
</ul>

      
    </div>
  )
}