const HomePage = () => {
  return (
    <div className="bg-slate-50">
      <section className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Get expert academic help on{" "}
            <span className="text-indigo-600">EduSupportHub</span>
          </h1>
          <p className="text-sm text-slate-600">
            Post assignments, receive offers from vetted experts, chat securely,
            and pay only when you&apos;re satisfied.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href="/register"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Get started as a student
            </a>
            <a
              href="/expert-apply"
              className="rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50"
            >
              Become an expert
            </a>
          </div>
        </div>
        <div className="flex-1 rounded-2xl bg-white shadow-sm p-6 text-sm text-slate-700">
          <h2 className="font-semibold mb-3">Why EduSupportHub?</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>Secure payments and escrow-like flow</li>
            <li>Experts across dozens of subjects</li>
            <li>Messaging and file sharing in one place</li>
            <li>Transparent ratings and reviews</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
