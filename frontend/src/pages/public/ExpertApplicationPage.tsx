const ExpertApplicationPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-slate-700">
      <h1 className="text-xl font-semibold text-slate-900 mb-3">
        Become an expert on EduSupportHub
      </h1>
      <p className="mb-4">
        Fill in this application to be considered as an expert. After
        registration, our admins may contact you for verification.
      </p>
      <p className="mb-3 text-xs text-slate-500">
        Note: for now, simply create an &quot;expert&quot; account via the
        registration page. This application form can be extended to upload
        diplomas and documents later.
      </p>
      <a
        href="/register"
        className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
      >
        Register as expert
      </a>
    </div>
  );
};

export default ExpertApplicationPage;
