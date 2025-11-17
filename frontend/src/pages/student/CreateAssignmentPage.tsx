import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AssignmentsAPI } from "../../api/assignments";

const CreateAssignmentPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const subject = data.get("subject") as string;
    const academicLevel = data.get("academicLevel") as string;
    const deadline = data.get("deadline") as string;
    const budgetMin = Number(data.get("budgetMin") || 0) || undefined;
    const budgetMax = Number(data.get("budgetMax") || 0) || undefined;

    try {
      await AssignmentsAPI.create({
        title,
        description,
        subject,
        academicLevel,
        deadline,
        budgetMin,
        budgetMax,
      });
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
        <div>
          <label className="mb-1 block font-medium text-slate-700">Title</label>
          <input
            name="title"
            className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Subject
            </label>
            <input
              name="subject"
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Academic level
            </label>
            <input
              name="academicLevel"
              placeholder="High school / Undergraduate"
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block font-medium text-slate-700">
            Deadline
          </label>
          <input
            type="datetime-local"
            name="deadline"
            className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Min budget (optional)
            </label>
            <input
              type="number"
              name="budgetMin"
              min={0}
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium text-slate-700">
              Max budget (optional)
            </label>
            <input
              type="number"
              name="budgetMax"
              min={0}
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
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
