"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { parseFile } from "@/lib/parseData";
import { ParsedData } from "@/lib/types";

interface FileUploadProps {
  onDataParsed: (data: ParsedData, fileName: string) => void;
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ rows: number; cols: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsParsing(true);
      try {
        const result = await parseFile(file);
        setFileName(file.name);
        setFileInfo({ rows: result.data.length, cols: result.columns.length });
        onDataParsed(result, file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file");
        setFileName(null);
        setFileInfo(null);
      }
      setIsParsing(false);
    },
    [onDataParsed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const clearFile = () => {
    setFileName(null);
    setFileInfo(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        className="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200"
        style={{
          borderColor: isDragging
            ? "var(--accent-primary)"
            : error
              ? "var(--error)"
              : "var(--border-primary)",
          backgroundColor: isDragging
            ? "var(--accent-primary-subtle)"
            : "transparent",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {isParsing ? (
          <div className="py-4">
            <div className="w-8 h-8 mx-auto mb-3 rounded-lg shimmer" />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Parsing file...
            </p>
          </div>
        ) : fileName ? (
          <div className="py-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {fileName}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            {fileInfo && (
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {fileInfo.rows} rows &middot; {fileInfo.cols} columns
              </p>
            )}
          </div>
        ) : (
          <div className="py-4">
            <Upload className="w-6 h-6 mx-auto mb-3" style={{ color: "var(--text-tertiary)" }} />
            <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
              Drop a CSV or Excel file here
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              or click to browse
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
