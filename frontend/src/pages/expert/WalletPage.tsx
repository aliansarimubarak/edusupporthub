import React, { useEffect, useMemo, useState } from "react";
import { OrdersAPI, type Order } from "../../api/orders";
import { WalletAPI } from "../../api/wallet";

type WithdrawMethod = "BANK" | "ESEWA" | "KHALTI" | "OTHER";

const WalletPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Withdraw form state
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<WithdrawMethod>("BANK");
  const [accountDetails, setAccountDetails] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    OrdersAPI.listMine()
      .then((data) => {
        setOrders(data);
      })
      .catch(() => {
        setError("Could not load your orders and earnings.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Completed orders = real earnings
  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "COMPLETED"),
    [orders]
  );

  const lifetimeEarnings = useMemo(
    () =>
      completedOrders.reduce(
        (sum, o) => sum + (o.agreedPrice || 0),
        0
      ),
    [completedOrders]
  );

  // For now, we treat everything as available (no payouts implemented yet).
  // Later you can subtract completed payouts from this value.
  const availableBalance = lifetimeEarnings;

  const activeOrdersTotal = useMemo(
    () =>
      orders
        .filter((o) => o.status === "IN_PROGRESS")
        .reduce((sum, o) => sum + (o.agreedPrice || 0), 0),
    [orders]
  );

  const completedCount = completedOrders.length;

  const recentEarnings = useMemo(
    () =>
      [...completedOrders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 6),
    [completedOrders]
  );

  const handleWithdrawSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      setFormError("Please enter a valid withdrawal amount.");
      return;
    }
    if (parsedAmount > availableBalance) {
      setFormError("You cannot withdraw more than your available balance.");
      return;
    }
    if (!accountDetails.trim()) {
      setFormError("Please provide payout account details.");
      return;
    }

    setSubmitting(true);
    try {
      await WalletAPI.requestWithdrawal({
        amount: parsedAmount,
        method,
        accountDetails,
        note,
        currency: "USD",
      });
      setSuccessMessage(
        "Withdrawal request submitted to admin. You will be notified once it is processed."
      );
      setAmount("");
      setNote("");
      // keep method & accountDetails for convenience
    } catch (err: any) {
      setFormError(
        err?.response?.data?.error || "Failed to submit withdrawal request."
      );
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Wallet & earnings
        </h1>
        <p className="mt-1 text-xs text-slate-500 max-w-2xl">
          Track how much you have earned from completed assignments, see which
          orders generated income, and request withdrawals from your EduSupportHub
          wallet to your preferred payout method.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Available balance
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            ${availableBalance.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Eligible to withdraw (based on completed orders)
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Lifetime earnings
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            ${lifetimeEarnings.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Total from all completed orders
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Active orders value
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            ${activeOrdersTotal.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Potential future earnings (in progress)
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Completed orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {completedCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Orders that have generated earnings
          </p>
        </div>
      </div>

      {/* Main content: earnings table + withdrawal form */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr,1.1fr]">
        {/* Earnings by assignment */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Earnings by assignment
              </h2>
              <p className="text-[11px] text-slate-500">
                See which assignments contributed to your wallet balance.
              </p>
            </div>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] text-slate-500">
              {completedCount} completed orders
            </span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500">Loading earnings…</p>
          ) : error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : completedOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-500">
              You don&apos;t have any completed orders yet. Once you complete
              assignments, your earnings will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2 text-left">Assignment</th>
                    <th className="px-3 py-2 text-left">Order ID</th>
                    <th className="px-3 py-2 text-left">Student</th>
                    <th className="px-3 py-2 text-left">Completed on</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEarnings.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-2 align-top">
                        <div className="font-medium text-slate-800">
                          {order.assignment.title}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top text-[11px] text-slate-500">
                        {order.id.slice(0, 10)}…
                      </td>
                      <td className="px-3 py-2 align-top text-[11px] text-slate-500">
                        {order.student?.name || "Student"}
                      </td>
                      <td className="px-3 py-2 align-top text-[11px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 align-top text-right font-semibold text-emerald-600">
                        ${(order.agreedPrice || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {completedOrders.length > recentEarnings.length && (
                <p className="mt-2 text-[11px] text-slate-400">
                  Showing latest {recentEarnings.length} of{" "}
                  {completedOrders.length} completed orders.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Withdraw request card */}
        <section className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Request withdrawal
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Submit a withdrawal request to the admin. Once approved, funds
              will be sent to your specified account or wallet.
            </p>

            <form onSubmit={handleWithdrawSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">
                  Amount to withdraw (USD)
                </label>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                  placeholder="e.g. 50.00"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Available: ${availableBalance.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">
                  Payout method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as WithdrawMethod)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                >
                  <option value="BANK">Bank transfer</option>
                  <option value="ESEWA">eSewa</option>
                  <option value="KHALTI">Khalti</option>
                  <option value="OTHER">Other wallet / method</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">
                  Account / wallet details
                </label>
                <textarea
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                  placeholder={
                    method === "BANK"
                      ? "Account holder name, bank name, branch, account number / IBAN…"
                      : "eSewa / Khalti ID, name, and any other required payout info…"
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">
                  Note to admin (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                  placeholder="Add any context, e.g. urgent fees, milestone completed, or clarification."
                />
              </div>

              {formError && (
                <p className="text-[11px] text-red-500">{formError}</p>
              )}
              {successMessage && (
                <p className="text-[11px] text-emerald-600">
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || availableBalance <= 0}
                className="w-full rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting request…" : "Send withdrawal request"}
              </button>

              <p className="mt-1 text-[10px] text-slate-400">
                Your request will be reviewed by the EduSupportHub admin team.
                Large withdrawals or unusual activity may require additional
                verification or collateral information.
              </p>
            </form>
          </div>

          {/* Placeholder for future payout history */}
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold text-slate-800">
              Payout history (coming soon)
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              In a future version, this section will show a detailed list of
              all payout requests, their status (pending / approved / paid),
              and the payout method used.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WalletPage;
