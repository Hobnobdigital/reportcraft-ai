"use client";

import { FileText } from "lucide-react";

interface NarrativePanelProps {
  narrative: string;
}

export function NarrativePanel({ narrative }: NarrativePanelProps) {
  const paragraphs = narrative.split("\n\n").filter(Boolean);
  const sections = ["Overview", "Key Findings", "Recommendations"];

  return (
    <div
      className="stripe-card p-6 animate-fadeUp"
      style={{ animationDelay: "640ms" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          Executive Summary
        </h3>
      </div>

      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <div key={i}>
            {sections[i] && (
              <p
                className="overline mb-2"
                style={{ color: "var(--accent-primary)" }}
              >
                {sections[i]}
              </p>
            )}
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {p}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
