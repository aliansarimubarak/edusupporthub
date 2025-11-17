const SupportPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-slate-700">
      <h1 className="text-xl font-semibold text-slate-900 mb-3">
        Support & Help
      </h1>
      <p className="mb-4">
        For account issues, disputes, or general questions, you can reach our
        support team using the form below.
      </p>
      <form className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Message
          </label>
          <textarea
            rows={4}
            className="w-full rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SupportPage;
