"use client";

export function LoadingState() {
  return (
    <div className="w-full space-y-6 animate-fadeUp">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => (
          <div key={i} className="glass-panel p-5 rounded-2xl" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="shimmer h-3 w-20 rounded-full mb-3" />
            <div className="shimmer h-8 w-28 rounded-md mb-3" />
            <div className="shimmer h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0,1].map(i => (
          <div key={i} className="glass-panel p-5 rounded-2xl">
            <div className="shimmer h-4 w-40 rounded-full mb-4" />
            <div className="shimmer h-72 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="shimmer h-4 w-40 rounded-full mb-4" />
          <div className="shimmer h-72 w-full rounded-lg" />
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col">
          <div className="shimmer h-4 w-48 rounded-full mb-8" />
          <div className="space-y-4 flex-1">
            {[100,92,97,85,94,88].map((w, i) => <div key={i} className="shimmer h-3 rounded-full" style={{ width: `${w}%` }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
