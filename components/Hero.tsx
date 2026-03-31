"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Upload, BarChart3, FileText, Layout } from "lucide-react";

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number;
    const duration = 1500;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end]);
  return <>{val.toLocaleString()}{suffix}</>;
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Mesh background */}
      <div className="mesh-bg"><div className="grid-pattern" /></div>

      <div className="relative max-w-[1400px] mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl stagger-enter">
          {/* Badge */}
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.06em] uppercase bg-[#635BFF]/15 text-[#635BFF] border border-[#635BFF]/20 mb-8">
              AI-Powered Analytics
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline text-5xl sm:text-6xl lg:text-7xl mb-6">
            Upload data.
            <br />
            Get an executive dashboard
            <br />
            <span className="bg-gradient-to-r from-[#635BFF] to-[#00D4AA] bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>
              in seconds.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white/50 mb-10 leading-relaxed max-w-2xl">
            AI-powered data storytelling for marketing teams. No SQL. No Looker. No waiting.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
            <Link href="/dashboard?template=campaign-performance" className="btn-primary py-3 px-6 text-[15px] rounded-xl">
              Try with Sample Data <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary py-3 px-6 text-[15px] rounded-xl">
              <Upload className="w-4 h-4" /> Upload Your Data
            </Link>
          </div>

          {/* Animated stats */}
          <div className="flex items-center gap-12 mb-20">
            {[
              { end: 10000, suffix: "+", label: "Datasets analyzed" },
              { end: 50, suffix: "ms", label: "Avg response" },
              { end: 49, suffix: "/5", label: "User rating" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl font-semibold text-white tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </span>
                <span className="text-[13px] text-white/30 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-enter">
          {[
            { icon: BarChart3, title: "AI Analysis", desc: "Claude AI identifies KPIs, recommends charts, and surfaces key insights from your data automatically." },
            { icon: Layout, title: "Template Library", desc: "Pre-built marketing templates for campaign performance, funnel analysis, and channel mix." },
            { icon: FileText, title: "PDF Export", desc: "Export polished, branded PDF reports with charts, KPIs, and executive narratives." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-panel p-6 rounded-2xl group">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 inline-flex mb-4 text-white/60 group-hover:text-[#635BFF] transition-colors duration-300">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h3 className="text-[15px] font-medium text-white/95 mb-2 tracking-tight">{title}</h3>
              <p className="text-[13px] text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-white/5">
          <p className="text-[13px] text-white/30 font-medium">
            Built by <span className="text-white/50">Kwame Sarfo-Mensah</span>
            {" "}&middot;{" "}
            <a href="https://github.com/kwamesarfo" target="_blank" rel="noopener noreferrer" className="text-[#635BFF] hover:text-[#635BFF]/80 transition-colors">GitHub</a>
          </p>
        </footer>
      </div>
    </section>
  );
}
