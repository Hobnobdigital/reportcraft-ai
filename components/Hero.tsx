"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Upload, BarChart3, FileText, Layout } from "lucide-react";

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1500, 1);
      setVal(Math.floor((p === 1 ? 1 : 1 - Math.pow(2, -10 * p)) * end));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end]);
  return <>{val.toLocaleString()}{suffix}</>;
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="mesh-bg"><div className="grid-pattern" /></div>
      <div className="relative max-w-[1400px] mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl stagger-enter">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.06em] uppercase mb-8"
              style={{ backgroundColor: "var(--accent-subtle)", color: "var(--stripe-purple)", border: "1px solid rgba(99,91,255,0.15)" }}>
              AI-Powered Analytics
            </span>
          </div>

          <h1 className="hero-headline text-5xl sm:text-6xl lg:text-7xl mb-6">
            Upload data.<br />
            Get an executive dashboard{" "}
            <span style={{ color: "var(--stripe-purple)" }}>in seconds.</span>
          </h1>

          <p className="text-lg mb-10 leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            AI-powered data storytelling for marketing teams. No SQL. No Looker. No waiting.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
            <Link href="/dashboard?template=campaign-performance" className="btn-primary py-3 px-6 text-[15px] rounded-lg">
              Try with Sample Data <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary py-3 px-6 text-[15px] rounded-lg">
              <Upload className="w-4 h-4" /> Upload Your Data
            </Link>
          </div>

          <div className="flex items-center gap-12 mb-20">
            {[{ end: 10000, suffix: "+", label: "Datasets analyzed" }, { end: 50, suffix: "ms", label: "Avg response" }, { end: 49, suffix: "/5", label: "User rating" }].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="metric text-2xl"><Counter end={s.end} suffix={s.suffix} /></span>
                <span className="text-[13px] mt-1" style={{ color: "var(--text-tertiary)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-enter">
          {/* Card 1: AI Analysis */}
          <div className="group relative rounded-2xl overflow-hidden cursor-default"
            style={{ border: "1px solid var(--border-primary)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(99,91,255,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            {/* Top gradient strip */}
            <div style={{ height: 4, background: "linear-gradient(90deg, #635BFF, #00D4AA)" }} />
            {/* Decorative background orb */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: "radial-gradient(circle, rgba(99,91,255,0.08) 0%, transparent 70%)" }} />
            <div className="relative p-7" style={{ backgroundColor: "var(--bg-elevated)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, rgba(99,91,255,0.12), rgba(99,91,255,0.04))", border: "1px solid rgba(99,91,255,0.15)" }}>
                <BarChart3 className="w-6 h-6" style={{ color: "#635BFF" }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>AI Analysis</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                Claude AI identifies KPIs, recommends chart types, and surfaces key insights from your data automatically.
              </p>
              <div className="flex items-center gap-4 pt-4" style={{ borderTop: "1px solid var(--border-secondary)" }}>
                {["KPI Detection", "Chart Recs", "Insights"].map(tag => (
                  <span key={tag} className="text-[11px] font-medium px-2 py-1 rounded-full"
                    style={{ backgroundColor: "var(--accent-subtle)", color: "#635BFF" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Template Library */}
          <div className="group relative rounded-2xl overflow-hidden cursor-default"
            style={{ border: "1px solid var(--border-primary)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(0,212,170,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ height: 4, background: "linear-gradient(90deg, #00D4AA, #0073E6)" }} />
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)" }} />
            <div className="relative p-7" style={{ backgroundColor: "var(--bg-elevated)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.12), rgba(0,212,170,0.04))", border: "1px solid rgba(0,212,170,0.15)" }}>
                <Layout className="w-6 h-6" style={{ color: "#00D4AA" }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Template Library</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                Pre-built marketing templates for campaign performance, funnel analysis, and channel mix reporting.
              </p>
              {/* Mini template previews */}
              <div className="flex gap-2 pt-4" style={{ borderTop: "1px solid var(--border-secondary)" }}>
                {["Campaign", "Funnel", "Channel Mix"].map((t, i) => (
                  <div key={t} className="flex-1 rounded-lg p-2 text-center text-[10px] font-semibold"
                    style={{ backgroundColor: i === 0 ? "rgba(0,212,170,0.08)" : "var(--bg-secondary)", color: i === 0 ? "#00D4AA" : "var(--text-tertiary)", border: `1px solid ${i === 0 ? "rgba(0,212,170,0.15)" : "var(--border-secondary)"}` }}>{t}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: PDF Export */}
          <div className="group relative rounded-2xl overflow-hidden cursor-default"
            style={{ border: "1px solid var(--border-primary)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(0,115,230,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ height: 4, background: "linear-gradient(90deg, #0073E6, #635BFF)" }} />
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: "radial-gradient(circle, rgba(0,115,230,0.08) 0%, transparent 70%)" }} />
            <div className="relative p-7" style={{ backgroundColor: "var(--bg-elevated)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, rgba(0,115,230,0.12), rgba(0,115,230,0.04))", border: "1px solid rgba(0,115,230,0.15)" }}>
                <FileText className="w-6 h-6" style={{ color: "#0073E6" }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Executive Reports</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                Generate Vancity-style PDF reports with AI narratives, lifestyle imagery, and data appendix.
              </p>
              {/* Mini report page preview */}
              <div className="flex gap-2 pt-4 items-end" style={{ borderTop: "1px solid var(--border-secondary)" }}>
                {[40, 56, 48, 36].map((h, i) => (
                  <div key={i} className="flex-1 rounded" style={{ height: h, backgroundColor: i === 0 ? "rgba(0,115,230,0.12)" : "var(--bg-tertiary)", border: `1px solid ${i === 0 ? "rgba(0,115,230,0.15)" : "var(--border-secondary)"}` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-24 pt-8" style={{ borderTop: "1px solid var(--border-primary)" }}>
          <p className="text-[13px] font-medium" style={{ color: "var(--text-tertiary)" }}>
            Built by <span style={{ color: "var(--text-secondary)" }}>Kwame Adoo</span>
          </p>
        </footer>
      </div>
    </section>
  );
}
