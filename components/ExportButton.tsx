"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { ExportModal } from "./ExportModal";
import { ExportOptions } from "@/lib/types";

interface ExportButtonProps {
  targetId: string;
  suggestedTitle?: string;
}

export function ExportButton({ targetId, suggestedTitle = "Dashboard Report" }: ExportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) return;

      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#050510", logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width + 120, canvas.height + 200] });

      const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

      // White background for PDF
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, canvas.width + 120, canvas.height + 200, "F");

      if (options.includeCover) {
        pdf.setFillColor(99, 91, 255);
        pdf.rect(60, 50, 4, 30, "F");
        pdf.setFontSize(24);
        pdf.setTextColor(10, 37, 64);
        pdf.text(options.title, 74, 72);
        pdf.setFontSize(11);
        pdf.setTextColor(136, 152, 170);
        pdf.text(date, 74, 92);
        pdf.text("Prepared by ReportCraft AI", canvas.width + 60, 72, { align: "right" });
      }

      const yOffset = options.includeCover ? 120 : 60;
      pdf.addImage(imgData, "PNG", 60, yOffset, canvas.width, canvas.height);
      pdf.setFontSize(9);
      pdf.setTextColor(136, 152, 170);
      pdf.text(date, 60, canvas.height + yOffset + 40);
      pdf.save(`${options.title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    }
    setIsExporting(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="btn-secondary text-sm px-4 py-2">
        <Download className="w-4 h-4" /> Export Report
      </button>
      <ExportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onExport={handleExport} isExporting={isExporting} suggestedTitle={suggestedTitle} />
    </>
  );
}
