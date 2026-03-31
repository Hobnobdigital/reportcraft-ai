"use client";

import { BarChart3, Filter, PieChart } from "lucide-react";
import { templates } from "@/lib/templates";
import { ParsedData } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = { BarChart3, Filter, PieChart };

interface TemplateSelectorProps { onSelect: (data: ParsedData, templateId: string) => void; activeTemplate: string | null; }

export function TemplateSelector({ onSelect, activeTemplate }: TemplateSelectorProps) {
  return (
    <div className="w-full flex flex-col">
      <span className="overline mb-3 px-1">Templates</span>
      <div className="flex flex-col gap-2.5">
        {templates.map(template => {
          const isActive = activeTemplate === template.id;
          const Icon = iconMap[template.icon] || BarChart3;
          return (
            <button key={template.id}
              onClick={() => onSelect({ data: template.data as Record<string, unknown>[], columns: template.columns }, template.id)}
              className="w-full text-left p-4 rounded-xl border flex items-start gap-3.5 transition-all duration-200"
              style={{
                borderColor: isActive ? "var(--stripe-purple)" : "var(--border-primary)",
                backgroundColor: isActive ? "var(--accent-subtle)" : "var(--bg-elevated)",
                boxShadow: isActive ? "0 1px 3px rgba(99,91,255,0.1)" : "none",
              }}>
              <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--accent-subtle)", color: "var(--stripe-purple)" }}>
                <Icon size={18} strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-1 pt-0.5 min-w-0">
                <span className="text-sm font-medium leading-none" style={{ color: "var(--text-primary)" }}>{template.name}</span>
                <span className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{template.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
