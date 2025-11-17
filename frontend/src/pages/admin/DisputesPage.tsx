const DisputesPage = () => {
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Disputes
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        In future versions, this page will let admins review disputes, inspect
        chat history, and issue refunds or resolutions.
      </p>
      <div className="rounded-xl bg-white p-4 shadow-sm text-xs text-slate-700">
        No disputes to show yet.
      </div>
    </div>
  );
};

export default DisputesPage;
