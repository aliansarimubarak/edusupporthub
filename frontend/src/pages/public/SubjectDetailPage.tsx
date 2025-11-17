import { useParams } from "react-router-dom";

const SubjectDetailPage = () => {
  const { id } = useParams();
  const name = id ? id.replace(/-/g, " ") : "Subject";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-900 mb-3 capitalize">
        {name} homework help
      </h1>
      <p className="text-sm text-slate-600 mb-4">
        Post your {name} assignments on EduSupportHub and receive bids from
        qualified experts. Chat with them, agree on pricing, and get your work
        delivered on time.
      </p>
      <ul className="list-disc ml-5 text-sm text-slate-700 space-y-1 mb-6">
        <li>Step 1: Create a free student account</li>
        <li>Step 2: Post your assignment with clear requirements</li>
        <li>Step 3: Compare offers from experts</li>
        <li>Step 4: Pay safely and get your solution</li>
      </ul>
      <a
        href="/register"
        className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
      >
        Get started
      </a>
    </div>
  );
};

export default SubjectDetailPage;
