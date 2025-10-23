import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, Download } from "lucide-react";

const ExportButtons = ({ data, columns, fileName = "report" }) => {
  const exportExcel = () => {
    const sheetData = [
      columns.map((col) => col.label),
      ...data.map((item) => columns.map((col) => item[col.field] ?? "")),
    ];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`${fileName} Report`, 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [columns.map((col) => col.label)],
      body: data.map((item) => columns.map((col) => item[col.field] ?? "")),
    });
    doc.save(`${fileName}.pdf`);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button
        onClick={exportPDF}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "8px 14px",
          backgroundColor: "white",
          fontWeight: "500",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
      >
        <Download size={18} /> PDF
      </button>

      <button
        onClick={exportExcel}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "8px 14px",
          backgroundColor: "white",
          fontWeight: "500",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
      >
        <FileSpreadsheet size={18} /> Excel
      </button>
    </div>
  );
};

export default ExportButtons;
