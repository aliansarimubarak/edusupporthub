import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthAPI } from "../../api/auth";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthAPI.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-md">
        <h1 className="mb-1 text-lg font-semibold text-slate-900">
          Forgot password
        </h1>
        <p className="mb-4 text-[11px] text-slate-600">
          Enter your email address and we&apos;ll send you a link to reset
          your password.
        </p>

        {submitted ? (
          <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            If an account with that email exists, a password reset link has
            been sent. Please check your inbox.
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Sending link..." : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <div className="mt-4 text-center text-xs text-slate-600">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
