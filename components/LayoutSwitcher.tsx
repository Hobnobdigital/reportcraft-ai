"use client";

import { LayoutDashboard, Grid3x3, Monitor } from "lucide-react";
import { LayoutPreset } from "@/lib/types";

interface LayoutSwitcherProps { activeLayout: LayoutPreset; onLayoutChange: (l: LayoutPreset) => void; }
const options = [
  { id: "executive" as const, label: "Executive", icon: LayoutDashboard },
  { id: "deep-dive" as const, label: "Deep Dive", icon: Grid3x3 },
  { id: "presentation" as const, label: "Present", icon: Monitor },
];

export function LayoutSwitcher({ activeLayout, onLayoutChange }: LayoutSwitcherProps) {
  return (
    <div className="segmented-control">
      {options.map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => onLayoutChange(id)} className={activeLayout === id ? "active" : ""}>
          <span className="flex items-center gap-1.5">
            <Icon size={14} strokeWidth={activeLayout === id ? 2.5 : 2} />
            <span className="hidden sm:inline">{label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
