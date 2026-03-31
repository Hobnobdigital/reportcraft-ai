"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { ReportPreview } from "./ReportPreview";
import { AnalysisResult } from "@/lib/types";
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
  const [showPreview, setShowPreview] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    if (!analysis) return;

    // Open preview immediately with loading state
    setShowPreview(true);
    setIsGenerating(true);
    setReport(null);
    setError(null);
    setGenerationStep("Analyzing your data and crafting the narrative...");

    try {
      // Step 1: Generate report content via Claude
      const reportRes = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kpis: analysis.kpis,
          charts: analysis.charts,
          insights: analysis.insights,
          columns,
          templateName,
        }),
      });

      if (!reportRes.ok) {
        const errData = await reportRes.json().catch(() => ({}));
        throw new Error(errData.error || `Report generation failed (${reportRes.status})`);
      }

      const reportData = await reportRes.json();

      // Step 2: Generate lifestyle images via Replicate
      setGenerationStep("Generating lifestyle imagery for your report...");
      const imageUrls: string[] = [];
      const prompts = (reportData.imagePrompts || []).slice(0, 2);

      for (let i = 0; i < prompts.length; i++) {
        setGenerationStep(`Generating lifestyle image ${i + 1} of ${prompts.length}...`);
        try {
          const imgRes = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompts[i], index: i }),
          });
          if (imgRes.ok) {
            const { url } = await imgRes.json();
            if (url) imageUrls.push(url);
          }
        } catch {
          // Image generation is non-critical — continue
        }
      }

      setGenerationStep("Assembling your report...");

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
      setError(err instanceof Error ? err.message : "Report generation failed. Please try again.");
    }
    setIsGenerating(false);
    setGenerationStep("");
  };

  return (
    <>
      <button
        onClick={generateReport}
        className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!analysis || isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            Generate Report
          </>
        )}
      </button>

      {analysis && (
        <ReportPreview
          isOpen={showPreview}
          onClose={() => { setShowPreview(false); setError(null); }}
          report={report}
          analysis={analysis}
          isGenerating={isGenerating}
          generationStep={generationStep}
          error={error}
        />
      )}
    </>
  );
}
