"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { ReportPreview } from "./ReportPreview";
import { AnalysisResult } from "@/lib/types";
import { useAccessCode } from "./AccessCodeProvider";

interface ExportButtonProps {
  targetId: string;
  suggestedTitle?: string;
  analysis?: AnalysisResult;
  templateName?: string;
  columns?: string[];
}

interface ReportData {
  title: string;
  subtitle: string;
  date: string;
  executiveSummary: { overview: string; keyFindings: string; recommendations: string };
  chartCaptions: string[];
  imageUrls: string[];
  keyTakeaways: string[];
}

export function ExportButton({ targetId, suggestedTitle = "Dashboard Report", analysis, templateName, columns }: ExportButtonProps) {
  const { accessCode } = useAccessCode();
  const [showPreview, setShowPreview] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!analysis || !accessCode) return;
    setShowPreview(true);
    setIsGenerating(true);
    setReport(null);

    try {
      // Step 1: Generate report content via Claude
      const reportRes = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": accessCode },
        body: JSON.stringify({
          kpis: analysis.kpis,
          charts: analysis.charts,
          insights: analysis.insights,
          columns,
          templateName,
        }),
      });

      if (!reportRes.ok) throw new Error("Report generation failed");
      const reportData = await reportRes.json();

      // Step 2: Generate lifestyle images via Replicate
      const imageUrls: string[] = [];
      for (const prompt of (reportData.imagePrompts || []).slice(0, 2)) {
        try {
          const imgRes = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-access-code": accessCode },
            body: JSON.stringify({ prompt }),
          });
          if (imgRes.ok) {
            const { url } = await imgRes.json();
            if (url) imageUrls.push(url);
          }
        } catch {
          // Image generation is non-critical
        }
      }

      setReport({
        title: reportData.title || suggestedTitle,
        subtitle: reportData.subtitle || "",
        date: reportData.date || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        executiveSummary: reportData.executiveSummary || { overview: "", keyFindings: "", recommendations: "" },
        chartCaptions: reportData.chartCaptions || [],
        imageUrls,
        keyTakeaways: reportData.keyTakeaways || [],
      });
    } catch (err) {
      console.error("Report generation failed:", err);
    }
    setIsGenerating(false);
  };

  return (
    <>
      <button onClick={generateReport} className="btn-secondary text-sm px-4 py-2" disabled={!analysis}>
        <FileText className="w-4 h-4" /> Generate Report
      </button>

      {analysis && (
        <ReportPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          report={report}
          analysis={analysis}
          isGenerating={isGenerating}
        />
      )}
    </>
  );
}
