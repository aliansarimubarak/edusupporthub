
import { type FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AssignmentsAPI } from "../../api/assignments";
import type { Assignment } from "../../api/assignments";
import { OffersAPI } from "../../api/offers";
import type { Offer, ExpertRecentAssignmentPreview } from "../../api/offers";
import { Document, Page, pdfjs } from "react-pdf";
import { fileUrl } from "../../utils/fileUrl";

// Configure pdf.js worker for react-pdf
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const AssignmentOffersPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Full-window PDF viewer state
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  // Lock assignment if any offer has been accepted (order created)
  const assignmentLocked = offers.some((o) => o.status === "ACCEPTED");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      AssignmentsAPI.getById(id).catch(() => null),
      OffersAPI.listForAssignment(id).catch(() => []),
    ])
      .then(([a, o]) => {
        setAssignment(a as Assignment | null);
        setOffers(o as Offer[]);
      })
      .catch(() => setError("Failed to load assignment or offers"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAccept = async (offerId: string) => {
    if (!confirm("Accept this offer and create an order?")) return;

    setAcceptingId(offerId);
    setError(null);

    try {
      await OffersAPI.accept(offerId);
      alert("Offer accepted! Order has been created.");
      navigate("/student/orders");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to accept offer");
    } finally {
      setAcceptingId(null);
    }
  };

  if (!id) {
    return (
      <div className="text-xs text-slate-500">
        No assignment id provided.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-xs text-slate-500">
        Loading assignment and offers...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Offers for assignment
          </h2>
          <Link
            to="/student/orders"
            className="text-xs text-indigo-600 hover:underline"
          >
            ← Back to My assignments &amp; orders
          </Link>
        </div>

        {assignment && (
          <div className="flex flex-col gap-3 rounded-xl bg-white p-4 text-xs text-slate-700 shadow-sm md:flex-row md:items-start md:justify-between">
            <div>
              <div className="font-semibold text-slate-900">
                {assignment.title}
              </div>
              <div className="mt-1 text-slate-600">
                {assignment.description}
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Subject: {assignment.subject} · Level: {assignment.academicLevel} ·{" "}
                Deadline: {new Date(assignment.deadline).toLocaleString()}
              </div>
              {(assignment.budgetMin != null || assignment.budgetMax != null) && (
                <div className="mt-1 text-[11px] text-slate-500">
                  Budget:{" "}
                  {assignment.budgetMin != null &&
                    `$${assignment.budgetMin.toFixed(2)}`}{" "}
                  {assignment.budgetMin != null &&
                    assignment.budgetMax != null &&
                    "– "}
                  {assignment.budgetMax != null &&
                    `$${assignment.budgetMax.toFixed(2)}`}
                </div>
              )}
              {assignmentLocked && (
                <div className="mt-1 text-[11px] text-amber-600">
                  You have already accepted an offer for this assignment. Editing
                  is now disabled.
                </div>
              )}
            </div>

            <div className="flex items-start justify-end">
              <button
                type="button"
                onClick={() => !assignmentLocked && setEditOpen(true)}
                disabled={assignmentLocked}
                className={`rounded-full px-3 py-1.5 text-xs font-medium 
                ${
                  assignmentLocked
                    ? "border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {assignmentLocked
                  ? "Editing disabled (offer accepted)"
                  : "Edit assignment details"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">
            Offers from experts
          </h3>

          {offers.length === 0 ? (
            <p className="text-xs text-slate-500">
              No offers yet. Experts will send offers after they see your
              assignment.
            </p>
          ) : (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col gap-3 rounded-xl bg-white p-4 text-xs text-slate-700 shadow-sm"
              >
                {/* Top: expert summary + offer details */}
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {offer.expert?.name ?? "Expert"}
                    </div>
                    {offer.expert?.expertProfile && (
                      <div className="text-[11px] text-slate-500">
                        Rating:{" "}
                        {offer.expert.expertProfile.rating.toFixed(1)} / 5 ·{" "}
                        Completed {offer.expert.expertProfile.completedOrders}{" "}
                        orders
                      </div>
                    )}
                    <div className="mt-2">
                      <span className="font-medium">Message: </span>
                      {offer.message}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500">
                      Sent on {new Date(offer.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-semibold text-slate-900">
                      ${offer.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Delivery in {offer.deliveryDays} day(s)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Status: {offer.status}
                    </div>
                    {offer.status === "PENDING" && (
                      <button
                        onClick={() => handleAccept(offer.id)}
                        disabled={acceptingId === offer.id}
                        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                      >
                        {acceptingId === offer.id
                          ? "Accepting..."
                          : "Accept offer"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom: recent completed assignments preview */}
                {offer.expertRecentAssignments &&
                  offer.expertRecentAssignments.length > 0 && (
                    <ExpertRecentAssignmentsStrip
                      items={offer.expertRecentAssignments}
                      onPreviewClick={(url) => setPreviewPdfUrl(url)}
                    />
                  )}
              </div>
            ))
          )}
        </div>

        {assignment && editOpen && !assignmentLocked && (
          <EditAssignmentDialog
            assignment={assignment}
            onClose={() => setEditOpen(false)}
            onUpdated={setAssignment}
          />
        )}
      </div>

      {/* Full-window PDF overlay using browser viewer */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-2 text-xs text-slate-100">
            <span>PDF preview</span>
            <button
              type="button"
              onClick={() => setPreviewPdfUrl(null)}
              className="rounded px-2 py-1 text-[11px] hover:bg-slate-800"
            >
              Close ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="flex h-full w-full items-center justify-center p-4">
              <div className="w-full max-w-5xl flex justify-center">
                <Document
                  file={previewPdfUrl}
                  loading={
                    <div className="flex h-40 items-center justify-center text-xs text-slate-200">
                      Loading PDF...
                    </div>
                  }
                  error={
                    <div className="flex h-40 items-center justify-center text-xs text-red-300">
                      Failed to load PDF
                    </div>
                  }
                >
                  <Page
                    pageNumber={1}
                    width={900}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </Document>
              </div>
            </div>
          </div>          
        </div>
      )}
    </>
  );
};

export default AssignmentOffersPage;

/* ------------ Recent assignments preview strip ------------ */

const ExpertRecentAssignmentsStrip = ({
  items,
  onPreviewClick,
}: {
  items: ExpertRecentAssignmentPreview[];
  onPreviewClick: (pdfUrl: string) => void;
}) => {
  return (
    <div className="mt-2 border-t border-slate-100 pt-2">
      <div className="mb-2 text-[11px] font-semibold text-slate-600">
        Recent work by this expert (latest {Math.min(items.length, 10)}{" "}
        assignments)
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-40 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50/60 p-2"
          >
            {item.solutionPdfPath ? (
              <div
                className="mb-2 h-32 overflow-hidden rounded border border-slate-200 bg-white cursor-pointer hover:ring-2 hover:ring-indigo-500"
                onClick={() => onPreviewClick(fileUrl(item.solutionPdfPath!))}
                role="button"
                aria-label="Open PDF in full window"
              >
                <Document
                  file={fileUrl(item.solutionPdfPath)}
                  loading={
                    <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                      Loading PDF...
                    </div>
                  }
                  error={
                    <div className="flex h-full items-center justify-center text-[10px] text-red-400">
                      Preview error
                    </div>
                  }
                >
                  <Page pageNumber={1} width={140} />
                </Document>
              </div>
            ) : (
              <div className="mb-2 flex h-32 items-center justify-center rounded border border-dashed border-slate-200 bg-slate-100 text-[10px] text-slate-400">
                No PDF
              </div>
            )}

            <div className="text-[11px] font-semibold text-slate-800 line-clamp-2">
              {item.title}
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500 line-clamp-1">
              {item.subject}
            </div>
            <div className="mt-0.5 text-[10px] text-slate-400">
              {new Date(item.completedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------ Edit dialog component ------------ */

interface EditAssignmentDialogProps {
  assignment: Assignment;
  onClose: () => void;
  onUpdated: (updated: Assignment) => void;
}

const EditAssignmentDialog = ({
  assignment,
  onClose,
  onUpdated,
}: EditAssignmentDialogProps) => {
  const [title, setTitle] = useState(assignment.title);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(assignment.deadline);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  });
  const [budgetMin, setBudgetMin] = useState<string>(
    assignment.budgetMin != null ? String(assignment.budgetMin) : ""
  );
  const [budgetMax, setBudgetMax] = useState<string>(
    assignment.budgetMax != null ? String(assignment.budgetMax) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [minDeadline, setMinDeadline] = useState("");

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDeadline(now.toISOString().slice(0, 16));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const parsedBudgetMin =
      budgetMin.trim() !== "" ? Number(budgetMin) : undefined;
    const parsedBudgetMax =
      budgetMax.trim() !== "" ? Number(budgetMax) : undefined;

    // validate deadline (must be future)
    if (deadline) {
      const d = new Date(deadline);
      if (d.getTime() <= Date.now()) {
        setError("Deadline must be in the future.");
        setSaving(false);
        return;
      }
    }

    // validate budgets
    if (parsedBudgetMin !== undefined && parsedBudgetMin < 0) {
      setError("Minimum budget cannot be negative.");
      setSaving(false);
      return;
    }
    if (parsedBudgetMax !== undefined && parsedBudgetMax < 0) {
      setError("Maximum budget cannot be negative.");
      setSaving(false);
      return;
    }
    if (
      parsedBudgetMin !== undefined &&
      parsedBudgetMax !== undefined &&
      parsedBudgetMax < parsedBudgetMin
    ) {
      setError("Maximum budget cannot be less than minimum budget.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title,
        deadline: new Date(deadline).toISOString(),
        budgetMin: parsedBudgetMin,
        budgetMax: parsedBudgetMax,
      };

      const updated = await AssignmentsAPI.update(assignment.id, payload);
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Failed to update assignment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Edit assignment details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={minDeadline}
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
            <p className="mt-1 text-[10px] text-slate-400">
              You can adjust the deadline, but it must be in the future.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-slate-700">
                Min budget (USD)
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block font-medium text-slate-700">
                Max budget (USD)
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500">$</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
