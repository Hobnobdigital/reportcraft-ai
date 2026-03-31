"use client";

export function LoadingState() {
  return (
    <div className="w-full space-y-6 animate-fadeUp">
      {/* KPI skeleton row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <div
              className="h-3 w-20 rounded shimmer mb-3"
            />
            <div
              className="h-8 w-28 rounded shimmer mb-3"
            />
            <div
              className="h-10 w-full rounded shimmer"
            />
          </div>
        ))}
      </div>

      {/* Chart skeleton row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <div
              className="h-4 w-40 rounded shimmer mb-4"
            />
            <div
              className="h-72 w-full rounded shimmer"
            />
          </div>
        ))}
      </div>

      {/* Bottom row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div className="h-4 w-32 rounded shimmer mb-4" />
          <div className="h-72 w-full rounded shimmer" />
        </div>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div className="h-4 w-36 rounded shimmer mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 w-full rounded shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
