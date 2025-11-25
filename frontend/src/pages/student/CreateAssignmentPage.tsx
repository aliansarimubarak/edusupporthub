import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AssignmentsAPI } from "../../api/assignments";

const ASSIGNMENT_TITLES = [
  "Essay / Reflection",
  "Report / Analysis",
  "Case study",
  "Research proposal",
  "Presentation / Slides",
  "Thesis / Dissertation section",
  "Other",
];

const FACULTIES = [
  "Business & Management",
  "Science & Technology",
  "Health, Medicine & Nursing",
  "Law & Governance",
  "Accounting & Professional Courses",
  "Arts, Humanities & Education",
  "Agriculture & Environment",
  "Hospitality & Tourism",
];

const ACADEMIC_LEVELS = [
  "High school",
  "Undergraduate",
  "Postgraduate (Masters)",
  "PhD / Doctoral",
  "Professional / Certification",
];

const CreateAssignmentPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [minDeadline, setMinDeadline] = useState("");

  // compute min deadline = "now" in local time, formatted for datetime-local
  useEffect(() => {
    const now = new Date();
    // adjust for timezone so datetime-local shows correctly
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDeadline(now.toISOString().slice(0, 16));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const faculty = formData.get("faculty") as string;
    const subject = formData.get("subject") as string;
    const academicLevel = formData.get("academicLevel") as string;
    const description = formData.get("description") as string;
    const deadline = formData.get("deadline") as string;
    const budgetMinRaw = formData.get("budgetMin") as string | null;
    const budgetMaxRaw = formData.get("budgetMax") as string | null;
    const attachment = formData.get("attachment") as File | null;

    const budgetMin =
      budgetMinRaw && budgetMinRaw.trim() !== ""
        ? Number(budgetMinRaw)
        : undefined;
    const budgetMax =
      budgetMaxRaw && budgetMaxRaw.trim() !== ""
        ? Number(budgetMaxRaw)
        : undefined;

    // --- Frontend validation ---

    // Deadline must be in the future
    if (deadline) {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      if (deadlineDate.getTime() <= now.getTime()) {
        setError("Deadline must be in the future.");
        setLoading(false);
        return;
      }
    }

    // Budget must not be negative
    if (budgetMin !== undefined && budgetMin < 0) {
      setError("Minimum budget cannot be negative.");
      setLoading(false);
      return;
    }
    if (budgetMax !== undefined && budgetMax < 0) {
      setError("Maximum budget cannot be negative.");
      setLoading(false);
      return;
    }
    if (
      budgetMin !== undefined &&
      budgetMax !== undefined &&
      budgetMax < budgetMin
    ) {
      setError("Maximum budget cannot be less than minimum budget.");
      setLoading(false);
      return;
    }

    // File must be PDF if provided
    if (attachment && attachment.size > 0) {
      if (attachment.type !== "application/pdf") {
        setError("Only PDF files are allowed for assignment attachment.");
        setLoading(false);
        return;
      }
      // FormData already has "attachment", we keep it
    } else {
      setError("No file attached. Please upload a file and try again.");
      setLoading(false);
      return;
    }

    try {
      // NOTE: This now sends FormData (including the PDF) to the backend.
      // Make sure AssignmentsAPI.create is set up for multipart/form-data.
      await AssignmentsAPI.create(formData);

      alert("Assignment created!");
      navigate("/student/orders");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Create a new assignment
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Fill in the details to receive offers from experts.
      </p>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Assignment title (dropdown) */}
        <div>
          <label className="mb-1 block font-medium text-slate-700">
            Assignment type / title
          </label>
          <select
            name="title"
            className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select assignment type
            </option>
            {ASSIGNMENT_TITLES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Faculty dropdown */}
        <div>
          <label className="mb-1 block font-medium text-slate-700">
            Faculty
          </label>
          <select
            name="faculty"
            className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select faculty
            </option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Subject + academic level */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Subject / module
            </label>
            <input
              name="subject"
              placeholder="e.g. Marketing, Calculus, Nursing practice"
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Academic level
            </label>
            <select
              name="academicLevel"
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select level
              </option>
              {ACADEMIC_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Explain the assignment task, word count, referencing style, and any specific instructions."
            required
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="mb-1 block font-medium text-slate-700">
            Deadline
          </label>
          <input
            type="datetime-local"
            name="deadline"
            min={minDeadline}
            className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
          <p className="mt-1 text-[10px] text-slate-400">
            Please choose the final submission time in your local timezone. Past
            dates are not allowed.
          </p>
        </div>

        {/* Budget (USD, non-negative) */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Min budget (optional, USD)
            </label>
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-xs">$</span>
              <input
                type="number"
                name="budgetMin"
                min={0}
                step="0.01"
                className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Max budget (optional, USD)
            </label>
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-xs">$</span>
              <input
                type="number"
                name="budgetMax"
                min={0}
                step="0.01"
                className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* PDF attachment */}
        <div>
          <label className="mb-1 block font-medium text-slate-700">
            Attach assignment file (PDF, optional)
          </label>
          <input
            type="file"
            required
            name="attachment"
            accept="application/pdf"
            className="w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="mt-1 text-[10px] text-slate-400">
            You can upload the assignment brief or any supporting document in
            PDF format. Experts and admins will be able to view it.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create assignment"}
        </button>
      </form>
    </div>
  );
};

export default CreateAssignmentPage;
