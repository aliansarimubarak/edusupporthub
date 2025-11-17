const PaymentsPage = () => {
  return (
    <div className="max-w-xl">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Payments & billing
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        In a future version, this page will show your payment history and
        refunds. For now, payments may be handled outside the UI.
      </p>
      <div className="rounded-xl bg-white p-4 shadow-sm text-xs text-slate-700">
        No payment records yet.
      </div>
    </div>
  );
};

export default PaymentsPage;
