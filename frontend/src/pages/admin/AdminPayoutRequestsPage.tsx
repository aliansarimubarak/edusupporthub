import { useEffect, useMemo, useState } from "react";
import { AdminAPI, type PayoutRequest, type PayoutRequestStatus } from "../../api/admin";

const statusColors: Record<PayoutRequestStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 ring-blue-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const statusLabel: Record<PayoutRequestStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PAID: "Paid",
};

const FILTERS: (PayoutRequestStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "APPROVED",
  "PAID",
  "REJECTED",
];

const AdminPayoutRequestsPage = () => {
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("PENDING");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  const loadRequests = () => {
    setLoading(true);
    setError(null);
    AdminAPI.payoutRequests()
      .then(setRequests)
      .catch(() => setError("Could not load payout requests."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (activeFilter === "ALL") return requests;
    return requests.filter((r) => r.status === activeFilter);
  }, [requests, activeFilter]);

  const handleUpdateStatus = async (id: string, status: PayoutRequestStatus) => {
    setUpdatingId(id);
    setGlobalMessage(null);
    try {
      const updated = await AdminAPI.updatePayoutRequestStatus(id, status);
      setRequests((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      setGlobalMessage(`Request marked as ${statusLabel[status].toLowerCase()}.`);
      setTimeout(() => setGlobalMessage(null), 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Failed to update payout request status. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPending = useMemo(
    () =>
      requests
        .filter((r) => r.status === "PENDING")
        .reduce((sum, r) => sum + r.amount, 0),
    [requests]
  );

  const totalPaid = useMemo(
    () =>
      requests
        .filter((r) => r.status === "PAID")
        .reduce((sum, r) => sum + r.amount, 0),
    [requests]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Expert payout requests
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-slate-500">
          Review withdrawal requests submitted by experts. You can approve, mark as
          paid, or reject requests once you verify the payout details and collateral
          information provided.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Pending amount
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">
            ${totalPending.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Total from all payout requests that are currently pending.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Total paid out
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            ${totalPaid.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Lifetime amount you have already sent to experts.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Total requests
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {requests.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Including pending, approved, rejected and paid.
          </p>
        </div>
      </div>

      {/* Filters + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-3 py-1 font-medium ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {filter === "ALL" ? "All" : statusLabel[filter]}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={loadRequests}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {globalMessage && (
        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {globalMessage}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Payout requests
          </h2>
          <p className="text-[11px] text-slate-400">
            {filteredRequests.length} request
            {filteredRequests.length === 1 ? "" : "s"} shown
          </p>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500">Loading payout requests…</p>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-500">
            No payout requests found for this filter. Try changing the status above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 text-left">Expert</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left">Method</th>
                  <th className="px-3 py-2 text-left">Account details</th>
                  <th className="px-3 py-2 text-left">Note</th>
                  <th className="px-3 py-2 text-left">Requested on</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    {/* Expert */}
                    <td className="px-3 py-3 align-top">
                      <div className="font-medium text-slate-800">
                        {req.expert?.name || "Expert"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {req.expert?.email}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-3 py-3 align-top">
                      <div className="font-semibold text-slate-900">
                        {req.currency} {req.amount.toFixed(2)}
                      </div>
                    </td>

                    {/* Method */}
                    <td className="px-3 py-3 align-top text-[11px] text-slate-600">
                      {req.method}
                    </td>

                    {/* Account details */}
                    <td className="px-3 py-3 align-top text-[11px] text-slate-600 max-w-xs">
                      <div className="line-clamp-3 whitespace-pre-wrap">
                        {req.accountDetails}
                      </div>
                    </td>

                    {/* Note */}
                    <td className="px-3 py-3 align-top text-[11px] text-slate-500 max-w-xs">
                      {req.note ? (
                        <div className="line-clamp-3 whitespace-pre-wrap">
                          {req.note}
                        </div>
                      ) : (
                        <span className="italic text-slate-400">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-3 py-3 align-top text-[11px] text-slate-500">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${statusColors[req.status]}`}
                      >
                        {statusLabel[req.status]}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 align-top text-right">
                      <div className="flex flex-col items-end gap-1 text-[11px] sm:flex-row sm:justify-end sm:gap-2">
                        {req.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              disabled={!!updatingId}
                              onClick={() =>
                                handleUpdateStatus(req.id, "APPROVED")
                              }
                              className="rounded-full bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              {updatingId === req.id
                                ? "Updating…"
                                : "Approve"}
                            </button>
                            <button
                              type="button"
                              disabled={!!updatingId}
                              onClick={() =>
                                handleUpdateStatus(req.id, "REJECTED")
                              }
                              className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {req.status === "APPROVED" && (
                          <button
                            type="button"
                            disabled={!!updatingId}
                            onClick={() => handleUpdateStatus(req.id, "PAID")}
                            className="rounded-full bg-emerald-600 px-3 py-1 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {updatingId === req.id ? "Updating…" : "Mark paid"}
                          </button>
                        )}

                        {(req.status === "REJECTED" ||
                          req.status === "PAID") && (
                          <span className="text-[11px] text-slate-400">
                            No actions available
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayoutRequestsPage;
