import { useEffect, useMemo, useState } from "react";
import {
  AdminAPI,
  type AdminExpertProfileForVerification,
  type ExpertVerificationStatus,
} from "../../api/admin";

const statusColors: Record<ExpertVerificationStatus, string> = {
  UNVERIFIED: "bg-slate-100 text-slate-700 ring-slate-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusLabel: Record<ExpertVerificationStatus, string> = {
  UNVERIFIED: "Unverified",
  PENDING: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};

const FILTERS: (ExpertVerificationStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "VERIFIED",
  "UNVERIFIED",
  "REJECTED",
];

const AdminExpertVerificationPage = () => {
  const [items, setItems] = useState<AdminExpertProfileForVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("PENDING");
  const [selected, setSelected] =
    useState<AdminExpertProfileForVerification | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    AdminAPI.expertVerificationList()
      .then((data) => {
        setItems(data);
      })
      .catch(() => setError("Could not load expert verification data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "ALL") return items;
    return items.filter((i) => i.verificationStatus === activeFilter);
  }, [items, activeFilter]);

  const pendingCount = items.filter((i) => i.verificationStatus === "PENDING").length;
  const verifiedCount = items.filter((i) => i.verificationStatus === "VERIFIED").length;

  const handleSelect = (item: AdminExpertProfileForVerification) => {
    setSelected(item);
    setAdminNote(item.verificationAdminNote || "");
  };

  const handleUpdate = async (status: ExpertVerificationStatus) => {
    if (!selected) return;
    setUpdating(true);
    setError(null);
    setGlobalMessage(null);

    try {
      const updated = await AdminAPI.updateExpertVerification(
        selected.user.id,
        status,
        adminNote || undefined
      );
      setItems((prev) =>
        prev.map((i) =>
          i.user.id === updated.user.id ? { ...i, ...updated } : i
        )
      );
      setSelected({ ...selected, ...updated });
      setGlobalMessage(
        `Expert marked as ${statusLabel[status].toLowerCase()}.`
      );
      setTimeout(() => setGlobalMessage(null), 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Failed to update verification status. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Expert profile verification
        </h1>
        <p className="mt-1 max-w-2xl text-xs text-slate-500">
          Review expert profiles, cross-check their information, and mark them as
          verified or rejected. Use the notes to record any collateral checks or
          manual verification steps you performed (e.g. ID check, LinkedIn match,
          institutional email).
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Pending experts
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {pendingCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Waiting for manual review.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Verified experts
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {verifiedCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Already approved and visible as verified.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Total profiles
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {items.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Includes all experts, regardless of status.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-3 py-1 font-medium ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {f === "ALL" ? "All" : statusLabel[f]}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={load}
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

      {/* Main layout: list + detail */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1.2fr]">
        {/* List */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Expert profiles
          </h2>

          {loading ? (
            <p className="text-xs text-slate-500">Loading experts…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-500">
              No expert profiles found for this filter.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 text-xs">
              {filtered.map((exp) => (
                <li
                  key={exp.id}
                  className={`flex cursor-pointer items-start justify-between gap-2 px-2 py-3 hover:bg-slate-50 ${
                    selected?.id === exp.id ? "bg-slate-50" : ""
                  }`}
                  onClick={() => handleSelect(exp)}
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      {exp.user.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {exp.user.email}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-slate-500">
                      {exp.subjects.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                      {exp.subjects.length > 3 && (
                        <span className="text-[10px] text-slate-400">
                          +{exp.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${
                      statusColors[exp.verificationStatus]
                    }`}
                  >
                    {statusLabel[exp.verificationStatus]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail / decision panel */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          {selected ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {selected.user.name}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {selected.user.email}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${
                    statusColors[selected.verificationStatus]
                  }`}
                >
                  {statusLabel[selected.verificationStatus]}
                </span>
              </div>

              <div className="mb-3">
                <h3 className="mb-1 text-xs font-semibold text-slate-600">
                  Bio
                </h3>
                <p className="text-xs text-slate-600">
                  {selected.bio || (
                    <span className="italic text-slate-400">
                      No bio provided.
                    </span>
                  )}
                </p>
              </div>

              <div className="mb-3 grid gap-3 md:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-xs font-semibold text-slate-600">
                    Degrees / qualifications
                  </h3>
                  {selected.degrees.length ? (
                    <ul className="space-y-0.5 text-xs text-slate-600">
                      {selected.degrees.map((d) => (
                        <li key={d}>• {d}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-slate-400">
                      None listed.
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="mb-1 text-xs font-semibold text-slate-600">
                    Languages
                  </h3>
                  {selected.languages.length ? (
                    <ul className="space-y-0.5 text-xs text-slate-600">
                      {selected.languages.map((l) => (
                        <li key={l}>• {l}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-slate-400">
                      None listed.
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <h3 className="mb-1 text-xs font-semibold text-slate-600">
                  Verification request message
                </h3>
                {selected.verificationRequestMessage ? (
                  <p className="rounded-lg bg-slate-50 px-2 py-2 text-xs text-slate-600 whitespace-pre-wrap">
                    {selected.verificationRequestMessage}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">
                    Expert did not provide a specific message.
                  </p>
                )}
              </div>

              <div className="mb-3">
                <h3 className="mb-1 text-xs font-semibold text-slate-600">
                  Admin verification notes
                </h3>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                  placeholder="Record what you checked: ID match, email domain, LinkedIn profile, manual references, etc."
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleUpdate("VERIFIED")}
                  disabled={updating}
                  className="rounded-full bg-emerald-600 px-4 py-1.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {updating ? "Saving…" : "Verify expert"}
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate("REJECTED")}
                  disabled={updating}
                  className="rounded-full bg-rose-50 px-4 py-1.5 font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-60"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate("UNVERIFIED")}
                  disabled={updating}
                  className="rounded-full bg-slate-50 px-4 py-1.5 font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 disabled:opacity-60"
                >
                  Mark unverified
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500">
              Select an expert from the list to review their profile and decide
              on verification.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminExpertVerificationPage;
