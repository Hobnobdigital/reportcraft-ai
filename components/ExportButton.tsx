"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface ExportButtonProps {
  targetId: string;
}

export function ExportButton({ targetId }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) return;

      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height + 80],
      });

      // Header
      pdf.setFontSize(18);
      pdf.setTextColor(10, 37, 64);
      pdf.text("ReportCraft AI", 40, 40);

      pdf.setFontSize(10);
      pdf.setTextColor(136, 152, 170);
      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.text(date, canvas.width - 40, 40, { align: "right" });

      // Dashboard
      pdf.addImage(imgData, "PNG", 0, 60, canvas.width, canvas.height);

      pdf.save(`reportcraft-dashboard-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    }
    setIsExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="btn-secondary text-sm px-4 py-2 disabled:opacity-50"
    >
      <Download className="w-4 h-4" />
      {isExporting ? "Exporting..." : "Export PDF"}
    </button>
  );
}
