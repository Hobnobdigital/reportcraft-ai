"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Unlock, Zap } from "lucide-react";
import { useAccessCode } from "./AccessCodeProvider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, clearAccessCode } = useAccessCode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(5, 5, 16, 0.8)" : "rgba(5, 5, 16, 0.4)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: scrolled ? "rgba(255,255,255,0.08)" : "transparent",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{
              background: "linear-gradient(135deg, #635BFF, #00D4AA)",
              boxShadow: "0 0 16px rgba(99, 91, 255, 0.4)",
            }}
          >
            <Zap size={16} className="fill-white" />
          </div>
          <span className="text-[15px] font-medium text-white tracking-tight">
            ReportCraft AI
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="text-[13px] font-medium text-white/50 hover:text-white transition-colors duration-200"
          >
            Dashboard
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={() => { if (isAuthenticated) clearAccessCode(); }}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/5 transition-all duration-200"
            aria-label={isAuthenticated ? "Lock" : "Locked"}
          >
            {isAuthenticated ? (
              <Unlock size={16} className="text-[#00D4AA]" />
            ) : (
              <Lock size={16} className="text-white/40" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
