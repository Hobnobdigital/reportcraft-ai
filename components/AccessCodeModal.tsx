"use client";

import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { useAccessCode } from "./AccessCodeProvider";

export function AccessCodeModal() {
  const { isAuthenticated, setAccessCode } = useAccessCode();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsValidating(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-code": code,
        },
        body: JSON.stringify({ data: [], columns: [], validate: true }),
      });

      if (res.status === 401) {
        setError("Invalid access code. Please try again.");
        setIsValidating(false);
        return;
      }

      setAccessCode(code);
    } catch {
      setAccessCode(code);
    }
    setIsValidating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(10, 37, 64, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />
      <div
        className="relative w-full max-w-md mx-4 p-8 bg-[var(--bg-primary)] border border-[var(--border-primary)] animate-scaleIn"
        style={{
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "var(--accent-primary-subtle)" }}
          >
            <Lock className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
          </div>
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          >
            Enter access code
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Enter your access code to use AI-powered features.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            placeholder="Enter access code"
            className="w-full px-4 py-3 text-sm border transition-all duration-150"
            style={{
              borderRadius: "var(--radius-md)",
              borderColor: error ? "var(--error)" : "var(--border-primary)",
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              height: 44,
            }}
            autoFocus
          />
          {error && (
            <p className="mt-2 text-xs" style={{ color: "var(--error)" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!code || isValidating}
            className="btn-primary w-full mt-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isValidating ? "Validating..." : "Continue"}
            {!isValidating && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
