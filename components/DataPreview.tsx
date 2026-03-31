"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ParsedData } from "@/lib/types";

interface DataPreviewProps {
  data: ParsedData;
  onDataChange?: (data: ParsedData) => void;
}

export function DataPreview({ data, onDataChange }: DataPreviewProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRows = data.data.slice(0, 10);

  useEffect(() => {
    if (editingCell && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
  }, [editingCell]);

  const handleSave = useCallback(() => {
    if (!editingCell || !onDataChange) { setEditingCell(null); return; }
    const newData = [...data.data];
    newData[editingCell.row] = { ...newData[editingCell.row], [editingCell.col]: editValue };
    onDataChange({ ...data, data: newData });
    setEditingCell(null);
  }, [editingCell, editValue, data, onDataChange]);

  return (
    <div className="w-full" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="flex justify-between items-end mb-3 px-1">
        <span className="overline">Data Preview</span>
        <span className="text-xs text-white/40" style={{ fontVariantNumeric: "tabular-nums" }}>
          {data.data.length} rows &middot; {data.columns.length} columns
        </span>
      </div>
      <div className="glass-panel rounded-xl overflow-x-auto">
        <table className="w-full border-collapse text-left whitespace-nowrap">
          <thead>
            <tr>
              {data.columns.map((col) => (
                <th key={col} className="px-3 py-2.5 text-[11px] font-semibold text-white/50 uppercase tracking-wider bg-white/[0.02] border-b border-white/5">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                {data.columns.map((col) => {
                  const isEditing = editingCell?.row === i && editingCell?.col === col;
                  return (
                    <td key={col} className="p-0 text-[13px] text-white/80 relative" style={{ fontVariantNumeric: "tabular-nums" }}
                      onDoubleClick={() => { if (onDataChange) { setEditingCell({ row: i, col }); setEditValue(row[col] != null ? String(row[col]) : ""); } }}
                    >
                      {isEditing ? (
                        <input ref={inputRef} value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={handleSave}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditingCell(null); }}
                          className="w-full px-3 py-2 text-[13px] text-white bg-transparent outline-none"
                          style={{ boxShadow: "inset 0 0 0 2px #635BFF" }}
                        />
                      ) : (
                        <div className="px-3 py-2 truncate max-w-[280px] cursor-default">{String(row[col] ?? "")}</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.data.length > 10 && <p className="text-xs mt-3 text-center text-white/30" style={{ fontVariantNumeric: "tabular-nums" }}>Showing 10 of {data.data.length} rows</p>}
    </div>
  );
}
