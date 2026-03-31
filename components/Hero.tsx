"use client";

import Link from "next/link";
import { ArrowRight, Upload, BarChart3, FileText, Layout } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-6" style={{ paddingTop: "5rem", paddingBottom: "var(--space-12)" }}>
        <div className="max-w-3xl flex flex-col items-start stagger-enter">
          <div>
            <span
              className="overline inline-flex items-center px-3 py-1 rounded-full mb-8"
              style={{ backgroundColor: "rgba(99,91,255,0.08)", color: "#635BFF" }}
            >
              AI-Powered Analytics
            </span>
          </div>

          <h1
            className="hero-headline mb-6"
            style={{ fontSize: "var(--font-size-hero)", color: "#0A2540" }}
          >
            Upload data.
            <br />
            Get an executive dashboard{" "}
            <span style={{ color: "#635BFF" }}>in seconds.</span>
          </h1>

          <p className="text-lg text-[#425466] mb-10 leading-relaxed max-w-2xl">
            AI-powered data storytelling for marketing teams. No SQL. No Looker. No waiting.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/dashboard?template=campaign-performance"
              className="btn-primary py-3 px-6 text-[15px] font-medium rounded-lg"
            >
              Try with Sample Data
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="btn-secondary py-3 px-6 text-[15px] font-medium rounded-lg"
            >
              <Upload className="w-4 h-4" />
              Upload Your Data
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 stagger-enter">
          <div className="stripe-card rounded-xl p-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
              style={{ backgroundColor: "rgba(99,91,255,0.08)" }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: "#635BFF" }} />
            </div>
            <h3 className="text-[#0A2540] font-semibold text-base mb-2" style={{ letterSpacing: "-0.01em" }}>
              AI Analysis
            </h3>
            <p className="text-[#425466] text-sm leading-relaxed">
              Claude AI identifies KPIs, recommends charts, and surfaces key insights from your data automatically.
            </p>
          </div>

          <div className="stripe-card rounded-xl p-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
              style={{ backgroundColor: "rgba(14,98,69,0.08)" }}
            >
              <Layout className="w-5 h-5" style={{ color: "#0E6245" }} />
            </div>
            <h3 className="text-[#0A2540] font-semibold text-base mb-2" style={{ letterSpacing: "-0.01em" }}>
              Template Library
            </h3>
            <p className="text-[#425466] text-sm leading-relaxed">
              Pre-built marketing templates for campaign performance, funnel analysis, and channel mix reporting.
            </p>
          </div>

          <div className="stripe-card rounded-xl p-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
              style={{ backgroundColor: "rgba(196,120,6,0.08)" }}
            >
              <FileText className="w-5 h-5" style={{ color: "#C47806" }} />
            </div>
            <h3 className="text-[#0A2540] font-semibold text-base mb-2" style={{ letterSpacing: "-0.01em" }}>
              PDF Export
            </h3>
            <p className="text-[#425466] text-sm leading-relaxed">
              Export polished, branded PDF reports with charts, KPIs, and executive narratives in one click.
            </p>
          </div>
        </div>

        <footer className="mt-24 pt-8 border-t border-[#E3E8EE]">
          <p className="text-[#8898AA] text-[13px] font-medium">
            Built by{" "}
            <span className="text-[#425466]">Kwame Sarfo-Mensah</span>
            {" "}&middot;{" "}
            <a
              href="https://github.com/kwamesarfo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#635BFF] hover:text-[#5851EA] transition-colors duration-200"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
