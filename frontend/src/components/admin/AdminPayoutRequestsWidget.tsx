import { useEffect, useMemo, useState } from "react";
import { AdminAPI, type PayoutRequest } from "../../api/admin";
import { Link } from "react-router-dom";

const AdminPayoutRequestsWidget = () => {
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await AdminAPI.payoutRequests();
        if (!ignore) setRequests(data);
      } catch (err) {
        if (!ignore) setError("Could not load payout requests.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const pending = useMemo(
    () => requests.filter((r) => r.status === "PENDING"),
    [requests]
  );

  const pendingAmount = useMemo(
    () => pending.reduce((sum, r) => sum + r.amount, 0),
    [pending]
  );

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-4 shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Payout requests
          </p>
          <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] text-slate-500">
            Admin
          </span>
        </div>

        {loading ? (
          <p className="mt-3 text-xs text-slate-500">
            Checking payout requests…
          </p>
        ) : error ? (
          <p className="mt-3 text-xs text-rose-500">{error}</p>
        ) : pending.length === 0 ? (
          <p className="mt-3 text-xs text-slate-500">
            No payout requests are pending right now.
          </p>
        ) : (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-slate-500">
              Pending requests from experts:
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {pending.length}{" "}
              <span className="text-sm font-normal text-slate-500">
                {pending.length === 1 ? "request" : "requests"}
              </span>
            </p>
            <p className="text-[11px] text-slate-500">
              Pending amount:{" "}
              <span className="font-semibold text-amber-600">
                ${pendingAmount.toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Link
          to="/admin/payout-requests"
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Review payout requests
        </Link>
        <p className="mt-1 text-[10px] text-slate-400">
          Approve or reject withdrawals after verifying expert details and
          collateral info.
        </p>
      </div>
    </div>
  );
};

export default AdminPayoutRequestsWidget;
