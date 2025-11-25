import { useParams, Link } from "react-router-dom";
import { faculties } from "../../data/faculties";

const FacultyDetailPage = () => {
  const { id } = useParams();
  const faculty = faculties.find((f) => f.id === id);

  if (!faculty) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold text-red-600">Faculty Not Found</h1>
        <Link
          to="/FacultyPage"
          className="text-blue-600 underline text-sm mt-3 block"
        >
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <Link to="/FacultyPage" className="text-blue-600 underline text-sm">
        ← Back to faculties
      </Link>

      <div className="flex items-center my-6 gap-3">
        <span className="text-4xl">{faculty.icon}</span>
        <h1 className="text-2xl font-semibold text-slate-900">
          {faculty.name}
        </h1>
      </div>

      <p className="text-slate-700">{faculty.description}</p>

      {/* <div>
        <h2 className="text-lg font-semibold text-slate-800">Who is this for?</h2>
        <p className="text-slate-600">{faculty.whoFor}</p>
      </div> */}

      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Programs & Areas Covered
        </h2>
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          {faculty.areas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
        <a
            href="/login"
            className="inline-block rounded-md bg-indigo-600 px-4 py-2 my-8 text-xs font-medium text-white hover:bg-indigo-700"
        >
            Get started
        </a>        
      </div>
    </div>
  );
};

export default FacultyDetailPage;
