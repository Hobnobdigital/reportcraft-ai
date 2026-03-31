"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, X, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
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
  generationStep?: string;
  error?: string | null;
}

/* Vancity: 1008x612pts landscape. We scale to fit viewport. */
const PW = 1008;
const PH = 612;

function ReportModal({ isOpen, onClose, report, analysis, isGenerating, generationStep, error }: ReportPreviewProps) {
  const [page, setPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (isOpen) setPage(0); }, [isOpen]);

  if (!isOpen) return null;

  const hasImage = report && report.imageUrls.length > 0;
  const totalPages = report ? (hasImage ? 5 : 4) : 0;

  const handleDownload = async () => {
    if (!pagesRef.current || !report) return;
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: [PW, PH] });
      const allPages = pagesRef.current.querySelectorAll("[data-page]");
      for (let i = 0; i < allPages.length; i++) {
        if (i > 0) pdf.addPage([PW, PH], "landscape");
        const el = allPages[i] as HTMLElement;
        const prev = el.style.display;
        el.style.display = "block";
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#FFFFFF", logging: false, width: PW, height: PH });
        el.style.display = prev;
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, PW, PH);
      }
      pdf.save(`${report.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    } catch (err) { console.error("PDF export failed:", err); }
    setIsExporting(false);
  };

  /* Scale factor to fit page in viewport */
  const scale = typeof window !== "undefined"
    ? Math.min((window.innerWidth - 80) / PW, (window.innerHeight - 200) / PH, 1)
    : 0.7;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(10,37,64,0.75)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={e => { if (e.target === e.currentTarget && !isGenerating) onClose(); }}
    >
      <div
        style={{
          display: "flex", flexDirection: "column",
          backgroundColor: "#FFFFFF",
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 24px 64px rgba(10,37,64,0.25)",
          maxWidth: "95vw", maxHeight: "95vh",
          width: PW * scale + 48,
          animation: "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* ===== HEADER BAR ===== */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", borderBottom: "1px solid #E3E8EE",
          backgroundColor: "#FFFFFF", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#0A2540" }}>
              {isGenerating ? "Generating Report..." : report ? report.title : "Report"}
            </span>
            {report && !isGenerating && (
              <span style={{ fontSize: 12, color: "#8898AA", backgroundColor: "#F6F9FC", padding: "2px 8px", borderRadius: 99 }}>
                Page {page + 1} / {totalPages}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {report && !isGenerating && (
              <>
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E3E8EE", background: "white", color: page === 0 ? "#E3E8EE" : "#425466", cursor: page === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E3E8EE", background: "white", color: page >= totalPages - 1 ? "#E3E8EE" : "#425466", cursor: page >= totalPages - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={16} />
                </button>
                <button onClick={handleDownload} disabled={isExporting}
                  style={{ marginLeft: 8, padding: "8px 16px", borderRadius: 8, backgroundColor: "#635BFF", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: isExporting ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6, opacity: isExporting ? 0.6 : 1 }}>
                  <Download size={14} />{isExporting ? "Exporting..." : "Download PDF"}
                </button>
              </>
            )}
            <button onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E3E8EE", background: "white", color: "#8898AA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#F0F3F7" }}>

          {/* LOADING */}
          {isGenerating && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <div style={{ width: 48, height: 48, margin: "0 auto 20px", border: "3px solid #E3E8EE", borderTop: "3px solid #635BFF", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#0A2540", marginBottom: 8 }}>Creating your report</p>
              <p style={{ fontSize: 14, color: "#425466" }}>{generationStep || "Preparing..."}</p>
              <p style={{ fontSize: 12, color: "#8898AA", marginTop: 16 }}>This usually takes 20-40 seconds</p>
            </div>
          )}

          {/* ERROR */}
          {error && !isGenerating && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <AlertCircle size={40} style={{ color: "#DF1B41", margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontSize: 16, fontWeight: 600, color: "#0A2540", marginBottom: 8 }}>Generation failed</p>
              <p style={{ fontSize: 14, color: "#425466", maxWidth: 400, margin: "0 auto 24px" }}>{error}</p>
              <button onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #E3E8EE", background: "white", color: "#425466", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Close</button>
            </div>
          )}

          {/* REPORT PAGES */}
          {report && !isGenerating && !error && (
            <div ref={pagesRef} style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
              {[...Array(totalPages)].map((_, idx) => (
                <div key={idx} data-page
                  style={{
                    width: PW, height: PH,
                    display: idx === page ? "block" : "none",
                    fontFamily: '"Geist", "Helvetica Neue", sans-serif',
                    boxShadow: "0 4px 24px rgba(10,37,64,0.12)",
                    overflow: "hidden", position: "relative", backgroundColor: "#FFFFFF",
                  }}>

                  {/* PAGE 1: COVER */}
                  {idx === 0 && (
                    <div style={{ width: "100%", height: "100%", backgroundColor: "#0A2540", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #635BFF, #00D4AA)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>R</div>
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500 }}>ReportCraft AI</span>
                      </div>
                      <div>
                        <div style={{ width: 64, height: 4, backgroundColor: "#635BFF", marginBottom: 32, borderRadius: 2 }} />
                        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 12 }}>{report.title}</h1>
                        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.4, marginBottom: 40 }}>{report.subtitle}</p>
                        <div style={{ display: "flex", gap: 32, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                          <span>{report.date}</span>
                          <span>Prepared by ReportCraft AI</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PAGE 2: EXECUTIVE SUMMARY */}
                  {idx === 1 && (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "48px 72px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E3E8EE", paddingBottom: 12, marginBottom: 32 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8898AA" }}>Executive Summary</span>
                        <span style={{ fontSize: 10, color: "#8898AA" }}>ReportCraft AI</span>
                      </div>
                      <div style={{ display: "flex", gap: 48, flex: 1 }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
                          <div>
                            <div style={{ width: 4, height: 24, backgroundColor: "#635BFF", borderRadius: 2, marginBottom: 12 }} />
                            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0A2540", letterSpacing: "-0.02em", marginBottom: 12 }}>Overview</h2>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#425466" }}>{report.executiveSummary.overview}</p>
                          </div>
                          <div>
                            <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#635BFF", marginBottom: 8 }}>Key Findings</h3>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#425466" }}>{report.executiveSummary.keyFindings}</p>
                          </div>
                          <div>
                            <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#635BFF", marginBottom: 8 }}>Recommendations</h3>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#425466" }}>{report.executiveSummary.recommendations}</p>
                          </div>
                        </div>
                        <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
                          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0A2540", marginBottom: 4 }}>Key Metrics</h3>
                          {analysis.kpis.slice(0, 4).map((kpi, i) => (
                            <div key={i} style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "#F6F9FC", border: "1px solid #E3E8EE" }}>
                              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8898AA", marginBottom: 4 }}>{kpi.label}</p>
                              <p style={{ fontSize: 24, fontWeight: 800, color: "#0A2540", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{formatValue(kpi.value, kpi.format)}</p>
                              <p style={{ fontSize: 11, color: kpi.trend === "up" ? "#0E6245" : "#DF1B41", marginTop: 4, fontWeight: 600 }}>
                                {kpi.trend === "up" ? "\u2191" : "\u2193"} {kpi.trendValue.toFixed(1)}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E3E8EE", paddingTop: 12, marginTop: 16, fontSize: 10, color: "#8898AA" }}>
                        <span>{report.date}</span><span>Page 2</span>
                      </div>
                    </div>
                  )}

                  {/* PAGE 3: FULL-BLEED IMAGE (if available) */}
                  {idx === 2 && hasImage && (
                    <div style={{ width: "100%", height: "100%", position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={report.imageUrls[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,37,64,0.7) 0%, rgba(10,37,64,0.3) 100%)" }} />
                      <div style={{ position: "absolute", bottom: 60, left: 72, right: 200 }}>
                        <div style={{ width: 48, height: 4, backgroundColor: "#635BFF", borderRadius: 2, marginBottom: 24 }} />
                        <p style={{ fontSize: 32, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                          {report.keyTakeaways[0] || "Data-driven decisions for sustainable growth"}
                        </p>
                      </div>
                      <div style={{ position: "absolute", bottom: 24, right: 48, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Page 3</div>
                    </div>
                  )}

                  {/* PAGE 4: DETAILED ANALYSIS */}
                  {idx === (hasImage ? 3 : 2) && (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "48px 72px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E3E8EE", paddingBottom: 12, marginBottom: 32 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8898AA" }}>Detailed Analysis</span>
                        <span style={{ fontSize: 10, color: "#8898AA" }}>ReportCraft AI</span>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
                        {analysis.charts.slice(0, 3).map((chart, i) => (
                          <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                            <div style={{ width: 4, minHeight: 40, backgroundColor: ["#635BFF", "#00D4AA", "#0073E6"][i], borderRadius: 2, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A2540", marginBottom: 6, letterSpacing: "-0.01em" }}>{chart.title}</h3>
                              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#425466" }}>{report.chartCaptions[i] || ""}</p>
                            </div>
                          </div>
                        ))}
                        <div style={{ marginTop: 8, paddingTop: 24, borderTop: "1px solid #E3E8EE" }}>
                          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0A2540", marginBottom: 16 }}>Key Takeaways</h3>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {report.keyTakeaways.map((t, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                <div style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: "#635BFF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#425466", paddingTop: 2 }}>{t}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E3E8EE", paddingTop: 12, marginTop: 16, fontSize: 10, color: "#8898AA" }}>
                        <span>{report.date}</span><span>Page {hasImage ? 4 : 3}</span>
                      </div>
                    </div>
                  )}

                  {/* LAST PAGE: DATA APPENDIX */}
                  {idx === totalPages - 1 && idx > (hasImage ? 3 : 2) && (
                    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "48px 72px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E3E8EE", paddingBottom: 12, marginBottom: 24 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8898AA" }}>Data Appendix</span>
                        <span style={{ fontSize: 10, color: "#8898AA" }}>ReportCraft AI</span>
                      </div>
                      {analysis.charts[0]?.data[0] && (
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                              <tr style={{ borderBottom: "2px solid #0A2540" }}>
                                {Object.keys(analysis.charts[0].data[0]).slice(0, 7).map(col => (
                                  <th key={col} style={{ padding: "8px 12px 8px 0", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0A2540" }}>{String(col)}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {analysis.charts[0].data.slice(0, 14).map((row, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #E3E8EE", backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F6F9FC" }}>
                                  {Object.values(row).slice(0, 7).map((val, j) => (
                                    <td key={j} style={{ padding: "6px 12px 6px 0", fontSize: 11, color: "#425466", fontVariantNumeric: "tabular-nums" }}>
                                      {typeof val === "number" ? val.toLocaleString() : String(val ?? "")}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E3E8EE", paddingTop: 12, marginTop: 16, fontSize: 10, color: "#8898AA" }}>
                        <span>{report.date}</span><span>Page {totalPages}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGE DOTS FOOTER */}
        {report && !isGenerating && !error && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0", gap: 8, borderTop: "1px solid #E3E8EE", backgroundColor: "#F6F9FC", flexShrink: 0 }}>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                style={{ height: 8, borderRadius: 4, border: "none", cursor: "pointer", transition: "all 0.3s", width: i === page ? 24 : 8, backgroundColor: i === page ? "#635BFF" : "#E3E8EE" }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Use portal to render on document.body — escapes all stacking contexts */
export function ReportPreview(props: ReportPreviewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !props.isOpen) return null;

  return createPortal(<ReportModal {...props} />, document.body);
}
