export default function DashboardLoading() {
  return (
    <div className="glass-panel animate-pulse">
      <div className="h-8 bg-white/20 rounded w-64 mb-4"></div>
      <div className="space-y-4">
        <div className="h-4 bg-white/20 rounded w-full"></div>
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </div>
    </div>
  );
}

