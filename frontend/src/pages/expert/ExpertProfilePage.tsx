import { useAuth } from "../../context/AuthContext";
import { ExpertAPI } from "../../api/expert";
import { useState, useEffect, useMemo } from "react";
import type {
  ExpertProfile,
  ExpertVerificationStatus,
} from "../../api/auth";

const verificationLabelMap: Record<ExpertVerificationStatus, string> = {
  UNVERIFIED: "Not verified",
  PENDING: "Pending review",
  VERIFIED: "Verified expert",
  REJECTED: "Verification rejected",
};

const verificationColorMap: Record<ExpertVerificationStatus, string> = {
  UNVERIFIED: "bg-slate-100 text-slate-700",
  PENDING: "bg-amber-50 text-amber-700",
  VERIFIED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
};

const ExpertProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ExpertProfile | null>(
    (user?.expertProfile as ExpertProfile | null) ?? null
  );
  const [loading, setLoading] = useState(!user?.expertProfile);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form fields (comma-separated chips)
  const [bio, setBio] = useState("");
  const [degreesText, setDegreesText] = useState("");
  const [subjectsText, setSubjectsText] = useState("");
  const [languagesText, setLanguagesText] = useState("");
  const [responseTimeMin, setResponseTimeMin] = useState<string>("");

  // Verification-related fields
  const [verificationMessage, setVerificationMessage] = useState("");
  const [requestingVerification, setRequestingVerification] = useState(false);

  const initials = useMemo(
    () =>
      user?.name
        ?.split(" ")
        .map((n) => n[0]?.toUpperCase())
        .slice(0, 2)
        .join("") || "EX",
    [user?.name]
  );

  const currentVerificationStatus: ExpertVerificationStatus =
    profile?.verificationStatus ?? "UNVERIFIED";

  // Helper to go from ["A","B"] -> "A, B"
  const joinList = (vals?: string[]) =>
    vals && vals.length > 0 ? vals.join(", ") : "";

  // Initialize form when we get a profile
  const applyProfileToForm = (p: ExpertProfile | null) => {
    setBio(p?.bio ?? "");
    setDegreesText(joinList(p?.degrees));
    setSubjectsText(joinList(p?.subjects));
    setLanguagesText(joinList(p?.languages));
    setResponseTimeMin(
      p?.responseTimeMin != null ? String(p.responseTimeMin) : ""
    );
    setVerificationMessage(p?.verificationRequestMessage ?? "");
  };

  // Load profile: use user.expertProfile if available, otherwise GET /experts/me
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        if (user?.expertProfile) {
          const p = user.expertProfile as ExpertProfile;
          if (!ignore) {
            setProfile(p);
            applyProfileToForm(p);
            setLoading(false);
          }
          return;
        }

        const fetched = await ExpertAPI.getMyProfile();
        if (!ignore) {
          setProfile(fetched);
          applyProfileToForm(fetched);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setError("Could not load your profile.");
          setLoading(false);
        }
      }
    };

    if (user?.role === "EXPERT") {
      load();
    }

    return () => {
      ignore = true;
    };
  }, [user?.role, user?.expertProfile]);

  // Convert comma-separated text to array of trimmed strings
  const splitList = (txt: string) =>
    txt
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    setError(null);

    try {
      const payload = {
        bio: bio || undefined,
        degrees: splitList(degreesText),
        subjects: splitList(subjectsText),
        languages: splitList(languagesText),
        responseTimeMin:
          responseTimeMin.trim() === ""
            ? undefined
            : Number(responseTimeMin.trim()),
      };

      const updated = await ExpertAPI.updateMyProfile(payload);
      setProfile(updated);
      applyProfileToForm(updated);
      setSaveMessage("Profile updated successfully.");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Failed to save profile. Please try again."
      );
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleRequestVerification = async () => {
    setRequestingVerification(true);
    setError(null);
    setSaveMessage(null);

    try {
      const updated = await ExpertAPI.requestVerification(
        verificationMessage || undefined
      );
      setProfile(updated);
      applyProfileToForm(updated);
      setSaveMessage("Verification request sent to admin.");
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Could not send verification request. Please try again."
      );
    } finally {
      setRequestingVerification(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  if (!user || user.role !== "EXPERT") {
    return (
      <div className="text-sm text-slate-500">
        You need to be logged in as an expert to view this page.
      </div>
    );
  }

  const stats = [
    {
      label: "Completed orders",
      value:
        profile?.completedOrders != null ? `${profile.completedOrders}` : "0",
    },
    {
      label: "Avg. rating",
      value:
        profile?.rating && profile.rating > 0
          ? `${profile.rating.toFixed(1)}/5`
          : "N/A",
    },
    {
      label: "Response time",
      value: profile?.responseTimeMin
        ? `< ${profile.responseTimeMin} min`
        : "Not set",
    },
    {
      label: "Verification",
      value: verificationLabelMap[currentVerificationStatus],
    },
  ];

  const profileCompletion = (() => {
    let score = 0;
    if (bio) score += 25;
    if (degreesText) score += 25;
    if (subjectsText) score += 25;
    if (languagesText) score += 25;
    return score;
  })();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Top header card */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Avatar + basics */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-semibold text-white">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">
                  {user?.name || "Expert name"}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    verificationColorMap[currentVerificationStatus]
                  }`}
                >
                  {verificationLabelMap[currentVerificationStatus]}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {bio
                  ? bio
                  : "Add a short bio so students understand your teaching style and strengths."}
              </p>
              <p className="mt-2 text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex flex-col items-stretch gap-3 text-sm sm:flex-row sm:items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Preview public profile
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {currentVerificationStatus !== "VERIFIED" &&
              currentVerificationStatus !== "PENDING" && (
                <button
                  type="button"
                  onClick={handleRequestVerification}
                  disabled={requestingVerification}
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                >
                  {requestingVerification
                    ? "Sending…"
                    : "Request verification"}
                </button>
              )}
          </div>
        </div>

        <p className="mt-2 text-[11px] text-slate-400">
          Note: Any changes to your profile will remove existing verification.
          Please request verification again after updating your details.
        </p>

        {loading && (
          <p className="mt-3 text-xs text-slate-400">Loading your profile…</p>
        )}
        {error && (
          <p className="mt-3 text-xs text-red-500">
            {error}
          </p>
        )}
        {saveMessage && (
          <p className="mt-3 text-xs text-emerald-600">
            {saveMessage}
          </p>
        )}
      </div>

      {/* Middle grid: stats + completion */}
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Performance overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3"
              >
                <div className="text-xs text-slate-500">{stat.label}</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile completion */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Profile completeness
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            Complete your profile to build trust with students and appear higher
            in search results.
          </p>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-slate-500">Overall progress</span>
            <span className="font-semibold text-slate-800">
              {profileCompletion}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            <li>• Add a short bio and headline</li>
            <li>• Add subjects & academic levels you support</li>
            <li>• Add languages, tools and availability</li>
          </ul>
        </div>
      </div>

      {/* Bottom sections: editable fields */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1.3fr]">
        {/* Left: expertise */}
        <div className="space-y-6">
          {/* About / bio edit */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                About & expertise
              </h2>
              <span className="text-[11px] text-slate-400">
                This is visible to students
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
              placeholder="Describe how you help students, your teaching style, and your strongest areas (e.g. case studies, reports, exam prep)…"
            />
          </section>

          {/* Subjects & levels */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Subjects & academic levels
              </h2>
              <span className="text-[11px] text-slate-400">
                Enter comma-separated values
              </span>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-xs font-semibold text-slate-500">
                Subjects
              </h3>
              <input
                value={subjectsText}
                onChange={(e) => setSubjectsText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                placeholder="e.g. Business Studies, Accounting, Economics"
              />
              {subjectsText && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {splitList(subjectsText).map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold text-slate-500">
                Degrees / qualifications
              </h3>
              <input
                value={degreesText}
                onChange={(e) => setDegreesText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                placeholder="e.g. BBA, MBA (Leadership), Teaching certificate"
              />
              {degreesText && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {splitList(degreesText).map((deg) => (
                    <span
                      key={deg}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
                    >
                      {deg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: languages, response time, verification */}
        <div className="space-y-6">
          {/* Languages & response time */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Languages & responsiveness
              </h2>
              <span className="text-[11px] text-slate-400">
                Students see this on your profile
              </span>
            </div>

            <div className="mb-3">
              <h3 className="mb-2 text-xs font-semibold text-slate-500">
                Languages
              </h3>
              <input
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                placeholder="e.g. English (Fluent), Nepali (Native)"
              />
              {languagesText && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {splitList(languagesText).map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-1 text-xs font-semibold text-slate-500">
                Typical response time (minutes)
              </h3>
              <input
                type="number"
                min={1}
                value={responseTimeMin}
                onChange={(e) => setResponseTimeMin(e.target.value)}
                className="w-40 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                placeholder="e.g. 60"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                This is an estimate to set expectations for students.
              </p>
            </div>
          </section>

          {/* Verification message & integrity */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Verification & integrity
              </h2>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-semibold text-slate-800">
                      Email verified
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Your email is verified during registration. This helps
                      students trust your profile.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <div>
                    <span className="font-semibold text-slate-800">
                      Academic integrity aligned
                    </span>
                    <p className="text-[11px] text-slate-500">
                      EduSupportHub experts provide guidance, structure, and
                      feedback. Students remain responsible for their final work
                      and institutional policies.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Verification message to admin
              </h3>
              <p className="mb-1 text-[11px] text-slate-500">
                Explain your qualifications or share references (e.g. degree,
                experience, LinkedIn, institutional email). This helps admin
                verify your profile.
              </p>
              <textarea
                value={verificationMessage}
                onChange={(e) => setVerificationMessage(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-200"
                placeholder="Example: MBA in Leadership, 3+ years tutoring in Business Studies, can provide transcripts and ID on request…"
              />
              {profile?.verificationAdminNote && (
                <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
                  Admin note: {profile.verificationAdminNote}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfilePage;
