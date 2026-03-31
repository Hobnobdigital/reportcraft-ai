"use client";

export function LoadingState() {
  return (
    <div className="w-full space-y-6 animate-fadeUp">
      {/* KPI skeleton row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#E3E8EE] bg-white p-5 animate-fadeUp"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="shimmer h-3 w-20 rounded-full mb-3" />
            <div className="shimmer h-8 w-28 rounded-md mb-3" />
            <div className="shimmer h-10 w-full rounded-md" />
          </div>
        ))}
      </div>

      {/* Chart skeleton row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#E3E8EE] bg-white p-5 animate-fadeUp"
            style={{ animationDelay: `${320 + i * 80}ms` }}
          >
            <div className="shimmer h-4 w-40 rounded-full mb-4" />
            <div className="shimmer h-72 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Bottom row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-xl border border-[#E3E8EE] bg-white p-5 animate-fadeUp"
          style={{ animationDelay: "480ms" }}
        >
          <div className="shimmer h-4 w-40 rounded-full mb-4" />
          <div className="shimmer h-72 w-full rounded-lg" />
        </div>
        <div
          className="rounded-xl border border-[#E3E8EE] bg-white p-5 flex flex-col animate-fadeUp"
          style={{ animationDelay: "560ms" }}
        >
          <div className="shimmer h-4 w-48 rounded-full mb-8" />
          <div className="space-y-4 flex-1">
            <div className="shimmer h-3 w-full rounded-full" />
            <div className="shimmer h-3 w-[92%] rounded-full" />
            <div className="shimmer h-3 w-[97%] rounded-full" />
            <div className="shimmer h-3 w-[85%] rounded-full" />
            <div className="pt-4 space-y-4">
              <div className="shimmer h-3 w-[94%] rounded-full" />
              <div className="shimmer h-3 w-[88%] rounded-full" />
              <div className="shimmer h-3 w-full rounded-full" />
              <div className="shimmer h-3 w-[75%] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
