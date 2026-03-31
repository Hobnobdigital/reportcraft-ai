"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Lock, Unlock } from "lucide-react";
import { useAccessCode } from "./AccessCodeProvider";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, clearAccessCode } = useAccessCode();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center transition-all duration-250"
      style={{
        backgroundColor: scrolled
          ? "var(--bg-primary)"
          : "transparent",
        borderBottom: scrolled ? "1px solid var(--border-primary)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="w-full max-w-content mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--gradient-accent)" }}
          >
            R
          </div>
          <span
            className="font-semibold text-base"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          >
            ReportCraft AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex btn-secondary text-sm px-4 py-2"
          >
            Dashboard
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-150"
              style={{
                color: "var(--text-secondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-tertiary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={() => {
              if (isAuthenticated) clearAccessCode();
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-150"
            style={{
              color: isAuthenticated ? "var(--success)" : "var(--text-tertiary)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-tertiary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            title={isAuthenticated ? "Authenticated — click to lock" : "Not authenticated"}
          >
            {isAuthenticated ? (
              <Unlock className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
