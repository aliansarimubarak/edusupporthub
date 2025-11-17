const SUBJECTS = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Business",
  "Computer Science",
  "History",
  "Psychology",
];

const SubjectsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">
        Subjects we support
      </h1>
      <p className="text-xs text-slate-600 mb-6">
        EduSupportHub connects you with experts across a wide range of
        disciplines.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {SUBJECTS.map((s) => (
          <a
            key={s}
            href={`/subjects/${encodeURIComponent(s.toLowerCase())}`}
            className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition text-sm text-slate-800"
          >
            {s} Homework Help
          </a>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
