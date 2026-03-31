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
    if (!code.trim()) return;
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(10, 37, 64, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-white animate-scaleIn overflow-hidden"
        style={{
          borderRadius: "var(--radius-xl)",
          border: "1px solid #E3E8EE",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div className="p-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
            style={{ backgroundColor: "rgba(99, 91, 255, 0.08)" }}
          >
            <Lock size={22} color="#635BFF" strokeWidth={2} />
          </div>

          <h2 className="text-xl font-semibold text-[#0A2540] mb-2 tracking-tight">
            Enter access code
          </h2>
          <p className="text-sm text-[#425466] mb-6 leading-relaxed">
            Enter your access code to use AI-powered features.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              placeholder="Enter access code"
              className="w-full px-4 py-3 text-sm text-[#0A2540] bg-white transition-all duration-150"
              style={{
                height: 44,
                borderRadius: "var(--radius-md)",
                border: `1px solid ${error ? "#DF1B41" : "#E3E8EE"}`,
              }}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-xs text-[#DF1B41] font-medium">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!code.trim() || isValidating}
              className="btn-primary w-full mt-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? (
                "Validating..."
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
