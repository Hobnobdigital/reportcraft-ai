"use client";

import { ParsedData } from "@/lib/types";

interface DataPreviewProps {
  data: ParsedData;
}

export function DataPreview({ data }: DataPreviewProps) {
  const previewRows = data.data.slice(0, 10);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="overline" style={{ color: "var(--text-tertiary)" }}>
          Data Preview
        </h3>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {data.data.length} rows &middot; {data.columns.length} columns
        </span>
      </div>
      <div
        className="overflow-x-auto rounded-lg border"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
              {data.columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left font-semibold whitespace-nowrap"
                  style={{
                    color: "var(--text-secondary)",
                    borderBottom: "1px solid var(--border-primary)",
                  }}
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
                style={{
                  borderBottom:
                    i < previewRows.length - 1
                      ? "1px solid var(--border-secondary)"
                      : "none",
                }}
              >
                {data.columns.map((col) => (
                  <td
                    key={col}
                    className="px-3 py-2 whitespace-nowrap"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {String(row[col] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.data.length > 10 && (
        <p
          className="text-xs mt-2 text-center"
          style={{ color: "var(--text-tertiary)" }}
        >
          Showing 10 of {data.data.length} rows
        </p>
      )}
    </div>
  );
}
