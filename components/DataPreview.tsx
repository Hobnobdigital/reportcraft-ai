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
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleDoubleClick = (rowIndex: number, col: string, value: unknown) => {
    if (!onDataChange) return;
    setEditingCell({ row: rowIndex, col });
    setEditValue(value != null ? String(value) : "");
  };

  const handleSave = useCallback(() => {
    if (!editingCell || !onDataChange) {
      setEditingCell(null);
      return;
    }
    const { row, col } = editingCell;
    const newData = [...data.data];
    newData[row] = { ...newData[row], [col]: editValue };
    onDataChange({ ...data, data: newData });
    setEditingCell(null);
  }, [editingCell, editValue, data, onDataChange]);

  return (
    <div className="w-full animate-fadeUp">
      <div className="flex justify-between items-end mb-3 px-1">
        <span className="overline text-[#8898AA]">Data Preview</span>
        <span className="text-xs text-[#8898AA]" style={{ fontVariantNumeric: "tabular-nums" }}>
          {data.data.length} rows &middot; {data.columns.length} columns
        </span>
      </div>

      <div
        className="rounded-lg overflow-x-auto bg-white"
        style={{
          border: "1px solid #E3E8EE",
          boxShadow: "0 2px 5px -1px rgba(50,50,93,0.05), 0 1px 3px -1px rgba(0,0,0,0.03)",
        }}
      >
        <table className="w-full border-collapse text-left whitespace-nowrap">
          <thead>
            <tr>
              {data.columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-xs font-semibold text-[#425466] bg-[#F6F9FC] tracking-tight"
                  style={{ borderBottom: "1px solid #E3E8EE" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, i) => (
              <tr
                key={i}
                className="transition-colors duration-150"
                style={{
                  backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F6F9FC",
                  borderBottom: i < previewRows.length - 1 ? "1px solid #F0F3F7" : "none",
                }}
              >
                {data.columns.map((col) => {
                  const isEditing = editingCell?.row === i && editingCell?.col === col;
                  return (
                    <td
                      key={col}
                      className="p-0 text-xs text-[#0A2540] relative"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                      onDoubleClick={() => handleDoubleClick(i, col, row[col])}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") setEditingCell(null);
                          }}
                          className="w-full px-3 py-2 text-xs text-[#0A2540] bg-white outline-none"
                          style={{ boxShadow: "inset 0 0 0 2px #635BFF" }}
                        />
                      ) : (
                        <div className="px-3 py-2 truncate max-w-[280px] cursor-default">
                          {String(row[col] ?? "")}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.data.length > 10 && (
        <p className="text-xs mt-3 text-center text-[#8898AA]" style={{ fontVariantNumeric: "tabular-nums" }}>
          Showing 10 of {data.data.length} rows
        </p>
      )}
    </div>
  );
}
