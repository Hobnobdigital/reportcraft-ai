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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-enter">
          {[
            { icon: BarChart3, title: "AI Analysis", desc: "Claude AI identifies KPIs, recommends charts, and surfaces key insights from your data automatically.", color: "var(--stripe-purple)", bg: "var(--accent-subtle)" },
            { icon: Layout, title: "Template Library", desc: "Pre-built marketing templates for campaign performance, funnel analysis, and channel mix.", color: "var(--stripe-green)", bg: "var(--success-subtle)" },
            { icon: FileText, title: "PDF Export", desc: "Export polished, branded PDF reports with charts, KPIs, and executive narratives.", color: "var(--stripe-amber)", bg: "var(--warning-subtle)" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="stripe-card p-6 group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
            </div>
          ))}
        </div>

        <footer className="mt-24 pt-8" style={{ borderTop: "1px solid var(--border-primary)" }}>
          <p className="text-[13px] font-medium" style={{ color: "var(--text-tertiary)" }}>
            Built by <span style={{ color: "var(--text-secondary)" }}>Kwame Sarfo-Mensah</span>
            {" "}&middot;{" "}
            <a href="https://github.com/kwamesarfo" target="_blank" rel="noopener noreferrer" style={{ color: "var(--stripe-purple)" }}>GitHub</a>
          </p>
        </footer>
      </div>
    </section>
  );
}
