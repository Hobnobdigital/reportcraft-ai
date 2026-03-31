"use client";

import { useState, useRef } from "react";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import { formatValue } from "@/lib/utils";

interface ReportData {
  title: string;
  subtitle: string;
  date: string;
  executiveSummary: { overview: string; keyFindings: string; recommendations: string };
  chartCaptions: string[];
  imageUrls: string[];
  keyTakeaways: string[];
}

interface ReportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportData | null;
  analysis: AnalysisResult;
  isGenerating: boolean;
}

const PAGE_W = 1056;
const PAGE_H = 672;

export function ReportPreview({ isOpen, onClose, report, analysis, isGenerating }: ReportPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const pages = reportRef.current.querySelectorAll("[data-report-page]");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [PAGE_W, PAGE_H] });

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage([PAGE_W, PAGE_H], "landscape");
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2, useCORS: true, backgroundColor: "#FFFFFF", logging: false,
          width: PAGE_W, height: PAGE_H,
        });
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, PAGE_W, PAGE_H);
      }

      pdf.save(`${report?.title?.replace(/\s+/g, "-").toLowerCase() || "report"}-${Date.now()}.pdf`);
    } catch (err) { console.error("PDF export failed:", err); }
    setIsExporting(false);
  };

  const totalPages = report ? 4 + (report.imageUrls.length > 0 ? 1 : 0) : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "rgba(10,37,64,0.85)", backdropFilter: "blur(12px)" }}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(10,37,64,0.95)" }}>
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
          <h2 className="text-[15px] font-semibold text-white">Report Preview</h2>
          {report && <span className="text-[13px] text-white/40">Page {currentPage + 1} of {totalPages}</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
              className="w-8 h-8 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}
              className="w-8 h-8 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          <button onClick={handleDownload} disabled={isExporting || !report}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 flex items-center gap-2 transition-all"
            style={{ backgroundColor: "#635BFF", boxShadow: "0 2px 8px rgba(99,91,255,0.3)" }}>
            <Download size={16} />{isExporting ? "Exporting..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        {isGenerating ? (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-2 border-white/20 border-t-[#635BFF] rounded-full animate-spin" />
            <p className="text-[15px] text-white/70 font-medium">Generating report...</p>
            <p className="text-[13px] text-white/40 mt-2">Creating narrative and generating images</p>
          </div>
        ) : report ? (
          <div ref={reportRef} className="relative">
            {/* All pages rendered but only current visible */}
            {[...Array(totalPages)].map((_, pageIdx) => (
              <div
                key={pageIdx}
                data-report-page
                className="bg-white overflow-hidden"
                style={{
                  width: PAGE_W, height: PAGE_H,
                  display: pageIdx === currentPage ? "block" : "none",
                  fontFamily: '"Geist", "Helvetica Neue", sans-serif',
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  borderRadius: 4,
                }}
              >
                {pageIdx === 0 && (
                  /* COVER PAGE */
                  <div className="w-full h-full relative flex flex-col justify-end p-16" style={{ backgroundColor: "#0A2540" }}>
                    <div className="absolute top-12 right-16 flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #635BFF, #00D4AA)" }}>R</div>
                      <span className="text-[13px] font-medium text-white/40">ReportCraft AI</span>
                    </div>
                    <div className="w-16 h-1 mb-8" style={{ backgroundColor: "#635BFF" }} />
                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight" style={{ lineHeight: 1.1 }}>{report.title}</h1>
                    <p className="text-lg text-white/50 mb-8">{report.subtitle}</p>
                    <div className="flex items-center gap-6 text-[13px] text-white/30">
                      <span>{report.date}</span>
                      <span>Prepared by ReportCraft AI</span>
                    </div>
                  </div>
                )}

                {pageIdx === 1 && (
                  /* EXECUTIVE SUMMARY */
                  <div className="w-full h-full flex flex-col p-12">
                    <div className="flex items-center justify-between mb-2 pb-3" style={{ borderBottom: "1px solid #E3E8EE" }}>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8898AA]">Executive Summary</span>
                      <span className="text-[10px] text-[#8898AA]">ReportCraft AI</span>
                    </div>
                    <div className="flex-1 flex gap-12 mt-6">
                      <div className="flex-1 space-y-6">
                        <div>
                          <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#635BFF] mb-2">Overview</h3>
                          <p className="text-[13px] leading-relaxed text-[#425466]">{report.executiveSummary.overview}</p>
                        </div>
                        <div>
                          <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#635BFF] mb-2">Key Findings</h3>
                          <p className="text-[13px] leading-relaxed text-[#425466]">{report.executiveSummary.keyFindings}</p>
                        </div>
                        <div>
                          <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#635BFF] mb-2">Recommendations</h3>
                          <p className="text-[13px] leading-relaxed text-[#425466]">{report.executiveSummary.recommendations}</p>
                        </div>
                      </div>
                      <div className="w-64 space-y-4">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0A2540] mb-3">Key Metrics</h3>
                        {analysis.kpis.slice(0, 4).map((kpi, i) => (
                          <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: "#F6F9FC", border: "1px solid #E3E8EE" }}>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8898AA] mb-1">{kpi.label}</p>
                            <p className="text-xl font-bold text-[#0A2540]" style={{ fontVariantNumeric: "tabular-nums" }}>{formatValue(kpi.value, kpi.format)}</p>
                            <p className="text-[11px] mt-1" style={{ color: kpi.trend === "up" ? "#0E6245" : "#DF1B41" }}>
                              {kpi.trend === "up" ? "+" : ""}{kpi.trendValue.toFixed(1)}% vs last period
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-center text-[10px] text-[#8898AA] mt-4">Page 2</div>
                  </div>
                )}

                {pageIdx === 2 && report.imageUrls[0] && (
                  /* FULL-PAGE LIFESTYLE IMAGE (page break) */
                  <div className="w-full h-full relative">
                    <img src={report.imageUrls[0]} alt="Report imagery" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,37,64,0.3), rgba(10,37,64,0.6))" }} />
                    <div className="absolute bottom-12 left-12 right-12">
                      <div className="w-12 h-1 mb-4" style={{ backgroundColor: "#635BFF" }} />
                      <p className="text-2xl font-bold text-white tracking-tight" style={{ lineHeight: 1.2 }}>
                        {report.keyTakeaways[0] || "Data-driven decisions for growth"}
                      </p>
                    </div>
                  </div>
                )}

                {pageIdx === (report.imageUrls[0] ? 3 : 2) && (
                  /* DETAILED ANALYSIS — chart captions */
                  <div className="w-full h-full flex flex-col p-12">
                    <div className="flex items-center justify-between mb-2 pb-3" style={{ borderBottom: "1px solid #E3E8EE" }}>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8898AA]">Detailed Analysis</span>
                      <span className="text-[10px] text-[#8898AA]">ReportCraft AI</span>
                    </div>
                    <div className="flex-1 mt-6 space-y-8">
                      {analysis.charts.slice(0, 3).map((chart, i) => (
                        <div key={i} className="flex gap-6">
                          <div className="flex-1">
                            <h3 className="text-[14px] font-semibold text-[#0A2540] mb-2">{chart.title}</h3>
                            <p className="text-[12px] leading-relaxed text-[#425466]">{report.chartCaptions[i] || ""}</p>
                          </div>
                          <div className="w-48 h-24 rounded-lg flex items-center justify-center text-[11px] text-[#8898AA]" style={{ backgroundColor: "#F6F9FC", border: "1px solid #E3E8EE" }}>
                            [Chart: {chart.type}]
                          </div>
                        </div>
                      ))}
                      <div className="pt-4" style={{ borderTop: "1px solid #E3E8EE" }}>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0A2540] mb-3">Key Takeaways</h3>
                        <ul className="space-y-2">
                          {report.keyTakeaways.map((t, i) => (
                            <li key={i} className="flex items-start gap-2 text-[12px] text-[#425466]">
                              <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5" style={{ backgroundColor: "#635BFF" }}>{i + 1}</span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="text-center text-[10px] text-[#8898AA] mt-4">Page {report.imageUrls[0] ? 4 : 3}</div>
                  </div>
                )}

                {pageIdx === totalPages - 1 && (
                  /* DATA APPENDIX */
                  <div className="w-full h-full flex flex-col p-12">
                    <div className="flex items-center justify-between mb-2 pb-3" style={{ borderBottom: "1px solid #E3E8EE" }}>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8898AA]">Data Appendix</span>
                      <span className="text-[10px] text-[#8898AA]">ReportCraft AI</span>
                    </div>
                    <div className="flex-1 mt-4 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr style={{ borderBottom: "2px solid #0A2540" }}>
                            {analysis.charts[0]?.data[0] && Object.keys(analysis.charts[0].data[0]).slice(0, 6).map(col => (
                              <th key={col} className="py-2 pr-4 text-[10px] font-bold uppercase tracking-wider text-[#0A2540]">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.charts[0]?.data.slice(0, 12).map((row, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #E3E8EE", backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F6F9FC" }}>
                              {Object.values(row).slice(0, 6).map((val, j) => (
                                <td key={j} className="py-1.5 pr-4 text-[11px] text-[#425466]" style={{ fontVariantNumeric: "tabular-nums" }}>
                                  {typeof val === "number" ? val.toLocaleString() : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid #E3E8EE" }}>
                      <span className="text-[10px] text-[#8898AA]">{report.date}</span>
                      <span className="text-[10px] text-[#8898AA]">Page {totalPages}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Page dots */}
      {report && (
        <div className="flex justify-center pb-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === currentPage ? 24 : 6, backgroundColor: i === currentPage ? "#635BFF" : "rgba(255,255,255,0.2)" }} />
          ))}
        </div>
      )}
    </div>
  );
}
