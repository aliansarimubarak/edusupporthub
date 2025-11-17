import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const role = (data.get("role") as string) || "student";

    try {
      await register({ name, email, password, role: role as "student" | "expert" });
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900 mb-1">
          Create an account
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Join EduSupportHub as a student or an expert.
        </p>

        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Full name
            </label>
            <input
              name="name"
              required
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-slate-700">
              Account type
            </label>
            <select
              name="role"
              defaultValue="student"
              className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="student">Student</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
