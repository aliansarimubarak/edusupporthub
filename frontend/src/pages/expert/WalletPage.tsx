const WalletPage = () => {
  return (
    <div className="max-w-xl">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Wallet & earnings
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        This page will show your total earnings, pending payouts, and payout
        history in future versions.
      </p>

      <div className="rounded-xl bg-white p-4 shadow-sm text-xs text-slate-700">
        No wallet data yet.
      </div>
    </div>
  );
};

export default WalletPage;
