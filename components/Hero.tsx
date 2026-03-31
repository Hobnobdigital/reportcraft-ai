"use client";

import Link from "next/link";
import { ArrowRight, Upload, BarChart3, FileText, Layout } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Hero area */}
      <div
        className="flex-1 flex items-center"
        style={{ paddingTop: "5rem", paddingBottom: "var(--space-12)" }}
      >
        <div className="w-full max-w-content mx-auto px-6">
          <div className="stagger-enter max-w-3xl">
            <div>
              <span
                className="overline inline-block mb-4 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--accent-primary-subtle)",
                  color: "var(--accent-primary)",
                }}
              >
                AI-Powered Analytics
              </span>
            </div>

            <h1
              className="hero-headline mb-6"
              style={{ fontSize: "var(--font-size-hero)", color: "var(--text-primary)" }}
            >
              Upload data.
              <br />
              Get an executive dashboard{" "}
              <span style={{ color: "var(--accent-primary)" }}>in seconds.</span>
            </h1>

            <p
              className="text-lg mb-8 max-w-xl"
              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
            >
              AI-powered data storytelling for marketing teams. No SQL. No Looker. No waiting.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard?template=campaign-performance" className="btn-primary py-3 px-6 text-base">
                Try with Sample Data
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard" className="btn-secondary py-3 px-6 text-base">
                <Upload className="w-4 h-4" />
                Upload Your Data
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="w-full max-w-content mx-auto px-6 pb-section-y">
        <div className="stagger-enter grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stripe-card p-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--accent-primary-subtle)" }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
            </div>
            <h3
              className="font-semibold text-base mb-2"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
            >
              AI Analysis
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Claude AI identifies KPIs, recommends charts, and surfaces key insights from your data automatically.
            </p>
          </div>

          <div className="stripe-card p-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--success-bg)" }}
            >
              <Layout className="w-5 h-5" style={{ color: "var(--success)" }} />
            </div>
            <h3
              className="font-semibold text-base mb-2"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
            >
              Template Library
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Pre-built marketing templates for campaign performance, funnel analysis, and channel mix reporting.
            </p>
          </div>

          <div className="stripe-card p-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--warning-bg)" }}
            >
              <FileText className="w-5 h-5" style={{ color: "var(--warning)" }} />
            </div>
            <h3
              className="font-semibold text-base mb-2"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
            >
              PDF Export
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Export polished, branded PDF reports with charts, KPIs, and executive narratives in one click.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 border-t text-center"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Built by{" "}
          <span style={{ color: "var(--text-secondary)" }}>Kwame Sarfo-Mensah</span>
          {" "}&middot;{" "}
          <a
            href="https://github.com/kwamesarfo"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150"
            style={{ color: "var(--accent-primary)" }}
          >
            GitHub
          </a>
        </p>
      </footer>
    </section>
  );
}
