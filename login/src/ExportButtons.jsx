import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FileSpreadsheet, Download } from "lucide-react";

const ExportButtons = ({ data, columns, fileName = "report", exportTargetId }) => {
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

  const exportPDF = async () => {
  const element = document.querySelector(`#${exportTargetId}`);

  if (!element) {
    alert("Shipment area not found!");
    return;
  }


  await new Promise((r) => setTimeout(r, 200));

  const canvas = await html2canvas(element, {
    scale: 2, 
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const margin = 10; 
  const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);
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
      >
        <FileSpreadsheet size={18} /> Excel
      </button>
    </div>
  );
};

export default ExportButtons;
