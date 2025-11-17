import { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin";

const AdminDashboardPage = () => {
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
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">
        EduSupportHub Admin
      </h1>
      {stats ? (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Active users</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.activeUsers}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total orders</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stats.orders}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              ${stats.revenue.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">Average rating</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">
              {stats.averageRating.toFixed(1)}★
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-500">Unable to load stats.</p>
      )}
    </div>
  );
};

export default AdminDashboardPage;
