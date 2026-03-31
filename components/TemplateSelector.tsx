"use client";

import { BarChart3, Filter, PieChart } from "lucide-react";
import { templates } from "@/lib/templates";
import { ParsedData } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Filter: <Filter className="w-5 h-5" />,
  PieChart: <PieChart className="w-5 h-5" />,
};

interface TemplateSelectorProps {
  onSelect: (data: ParsedData, templateId: string) => void;
  activeTemplate: string | null;
}

export function TemplateSelector({ onSelect, activeTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <h3
        className="overline px-1"
        style={{ color: "var(--text-tertiary)" }}
      >
        Templates
      </h3>
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() =>
            onSelect(
              { data: template.data as Record<string, unknown>[], columns: template.columns },
              template.id
            )
          }
          className="w-full text-left p-4 rounded-xl border transition-all duration-200"
          style={{
            borderColor:
              activeTemplate === template.id
                ? "var(--accent-primary)"
                : "var(--border-primary)",
            backgroundColor:
              activeTemplate === template.id
                ? "var(--accent-primary-subtle)"
                : "var(--bg-elevated)",
            boxShadow: activeTemplate === template.id ? "var(--shadow-sm)" : "none",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: "var(--accent-primary-subtle)",
                color: "var(--accent-primary)",
              }}
            >
              {iconMap[template.icon]}
            </div>
            <div className="min-w-0">
              <p
                className="text-sm font-medium mb-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                {template.name}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-tertiary)" }}
              >
                {template.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
