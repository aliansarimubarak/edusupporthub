import { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin";

const AnalyticsPage = () => {
  const [stats, setStats] = useState<{
    activeUsers: number;
    orders: number;
    revenue: number;
    averageRating: number;
  } | null>(null);

  useEffect(() => {
    AdminAPI.stats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Analytics overview
      </h2>
      {stats ? (
        <ul className="space-y-2 text-xs text-slate-700 rounded-xl bg-white p-4 shadow-sm">
          <li>Active users: {stats.activeUsers}</li>
          <li>Total orders: {stats.orders}</li>
          <li>Revenue: ${stats.revenue.toFixed(2)}</li>
          <li>Average rating: {stats.averageRating.toFixed(1)}★</li>
        </ul>
      ) : (
        <p className="text-xs text-slate-500">
          Unable to load analytics at this time.
        </p>
      )}
    </div>
  );
};

export default AnalyticsPage;
