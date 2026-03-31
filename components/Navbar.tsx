"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Zap, Sun, Moon } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: `1px solid ${scrolled ? "#E3E8EE" : "transparent"}`,
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, #635BFF, #00D4AA)", boxShadow: "0 2px 8px rgba(99,91,255,0.25)" }}>
            <Zap size={16} className="fill-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: "#0A2540" }}>
            ReportCraft AI
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard" className="text-[13px] font-medium transition-colors duration-200 hidden sm:block" style={{ color: "#8898AA" }}>
            Dashboard
          </Link>
          <div className="w-px h-4 hidden sm:block" style={{ backgroundColor: "#E3E8EE" }} />
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-[#F6F9FC]"
              style={{ color: "#8898AA" }} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
