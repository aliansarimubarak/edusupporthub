import { Link } from "react-router-dom";
import { faculties } from "../../data/faculties";

const FacultyPage = () => {
  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Faculties</h1>
      <p className="text-sm text-slate-600">
        Select a faculty to explore available programs and details.
      </p>

      <div className="grid gap-4">
        {faculties.map((f) => (
          <Link
            key={f.id}
            to={`/FacultyPage/${f.id}`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50 transition"
          >
            <span className="text-xl">{f.icon}</span>
            <span className="text-lg font-medium text-slate-800">
              {f.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FacultyPage;
