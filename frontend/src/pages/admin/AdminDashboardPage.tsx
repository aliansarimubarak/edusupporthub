import { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin";
import AdminPayoutRequestsWidget from "../../components/admin/AdminPayoutRequestsWidget";

interface AdminStats {
  activeUsers: number;
  orders: number;
  revenue: number;
  averageRating: number;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminAPI.stats();
        if (!ignore) {
          setStats(data);
        }
      } catch {
        if (!ignore) {
          setStats(null);
          setError("Unable to load stats.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          EduSupportHub Admin
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Overview of platform performance, user activity, and financial flows.
        </p>
      </div>

      {/* Stats cards */}
      <div className="rounded-2xl bg-white/60 p-4 shadow-sm">
        {loading ? (
          <p className="text-xs text-slate-500">Loading stats…</p>
        ) : error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : stats ? (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Active users
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats.activeUsers}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Total orders
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats.orders}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Revenue
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                ${stats.revenue.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Average rating
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-600">
                {stats.averageRating.toFixed(1)}★
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No stats available.</p>
        )}
      </div>

      {/* Secondary widgets row – includes payout requests */}
      <div className="grid gap-4 md:grid-cols-3">
        <AdminPayoutRequestsWidget />
        {/* You can add more small widgets here later, e.g.:
        <SomeOtherAdminWidget />
        <AnotherWidget />
        */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
