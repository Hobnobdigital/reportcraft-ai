"use client";

import { FileText } from "lucide-react";

interface NarrativePanelProps { narrative: string; }
const SECTIONS = ["Overview", "Key Findings", "Recommendations"];
const OPACITIES = [1, 0.6, 0.3];

export function NarrativePanel({ narrative }: NarrativePanelProps) {
  const paragraphs = narrative.split("\n\n").filter(Boolean);
  return (
    <div className="glass-panel flex flex-col overflow-hidden" style={{ animation: "fadeUp 0.6s var(--ease-out) 640ms both" }}>
      <div className="flex items-center gap-2.5 px-6 py-4" style={{ borderBottom: "1px solid var(--border-primary)" }}>
        <FileText size={18} style={{ color: "var(--stripe-purple)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Executive Summary</h3>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {paragraphs.map((text, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="overline" style={{ color: "var(--stripe-purple)" }}>{SECTIONS[i] || `Section ${i + 1}`}</span>
            <div className="pl-4 py-0.5" style={{ borderLeft: `3px solid rgba(99,91,255,${OPACITIES[i] ?? 0.3})` }}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
