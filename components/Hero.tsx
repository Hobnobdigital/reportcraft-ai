"use client";

import Link from "next/link";
import { ArrowRight, Upload, BarChart3, FileText, Layout } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Subtle gradient mesh on white */}
      <div className="fixed inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(99,91,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,212,170,0.03) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(0,115,230,0.02) 0%, transparent 50%), #FFFFFF"
      }} />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16">
        {/* ABOVE THE FOLD — Hero content */}
        <div className="max-w-2xl stagger-enter">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.06em] uppercase mb-5 sm:mb-6"
            style={{ backgroundColor: "rgba(99,91,255,0.08)", color: "#635BFF", border: "1px solid rgba(99,91,255,0.12)" }}>
            AI-Powered Analytics
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-5" style={{ color: "#0A2540", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            Upload data.{" "}
            <span className="block sm:inline">Get an executive dashboard</span>{" "}
            <span style={{ color: "#635BFF" }}>in seconds.</span>
          </h1>

          <p className="text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed" style={{ color: "#425466" }}>
            AI-powered data storytelling for marketing teams. No SQL. No Looker. No waiting.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
            <Link href="/dashboard?template=campaign-performance"
              className="btn-primary py-3 px-6 text-[15px] rounded-lg justify-center">
              Try with Sample Data <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard"
              className="btn-secondary py-3 px-6 text-[15px] rounded-lg justify-center">
              <Upload className="w-4 h-4" /> Upload Your Data
            </Link>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-16 sm:mt-20 lg:mt-24 stagger-enter">
          {/* Card 1: AI Analysis */}
          <div className="group relative rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E3E8EE", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(99,91,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #635BFF, #00D4AA)" }} />
            <div className="p-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, rgba(99,91,255,0.1), rgba(99,91,255,0.03))", border: "1px solid rgba(99,91,255,0.12)" }}>
                <BarChart3 className="w-5 h-5" style={{ color: "#635BFF" }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "#0A2540", letterSpacing: "-0.01em" }}>AI Analysis</h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#425466" }}>
                Claude identifies KPIs, recommends charts, and surfaces insights from your data automatically.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-3" style={{ borderTop: "1px solid #F0F3F7" }}>
                {["KPI Detection", "Chart Recs", "Insights"].map(tag => (
                  <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(99,91,255,0.06)", color: "#635BFF" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Template Library */}
          <div className="group relative rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E3E8EE", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(0,212,170,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #00D4AA, #0073E6)" }} />
            <div className="p-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.1), rgba(0,212,170,0.03))", border: "1px solid rgba(0,212,170,0.12)" }}>
                <Layout className="w-5 h-5" style={{ color: "#00D4AA" }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "#0A2540", letterSpacing: "-0.01em" }}>Template Library</h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#425466" }}>
                Pre-built marketing templates for campaign performance, funnel analysis, and channel mix.
              </p>
              <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid #F0F3F7" }}>
                {["Campaign", "Funnel", "Channel Mix"].map((t, i) => (
                  <div key={t} className="flex-1 rounded-lg py-1.5 text-center text-[10px] font-semibold"
                    style={{ backgroundColor: i === 0 ? "rgba(0,212,170,0.06)" : "#F6F9FC", color: i === 0 ? "#00D4AA" : "#8898AA", border: `1px solid ${i === 0 ? "rgba(0,212,170,0.12)" : "#F0F3F7"}` }}>{t}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Executive Reports */}
          <div className="group relative rounded-2xl overflow-hidden sm:col-span-2 lg:col-span-1"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E3E8EE", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(0,115,230,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #0073E6, #635BFF)" }} />
            <div className="p-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, rgba(0,115,230,0.1), rgba(0,115,230,0.03))", border: "1px solid rgba(0,115,230,0.12)" }}>
                <FileText className="w-5 h-5" style={{ color: "#0073E6" }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "#0A2540", letterSpacing: "-0.01em" }}>Executive Reports</h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#425466" }}>
                Generate PDF reports with AI narratives, lifestyle imagery, and data appendix.
              </p>
              <div className="flex gap-1.5 pt-3 items-end" style={{ borderTop: "1px solid #F0F3F7" }}>
                {[32, 44, 38, 28, 48].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: h, backgroundColor: i === 0 ? "rgba(0,115,230,0.1)" : i === 4 ? "rgba(99,91,255,0.08)" : "#F0F3F7" }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-16 sm:mt-20 pt-6 sm:pt-8" style={{ borderTop: "1px solid #E3E8EE" }}>
          <p className="text-[13px] font-medium" style={{ color: "#8898AA" }}>
            Built by <span style={{ color: "#425466" }}>Kwame Adoo</span>
          </p>
        </footer>
      </div>
    </section>
  );
}
