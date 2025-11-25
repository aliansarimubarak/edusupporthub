
import { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin";
import type { Order } from "../../api/orders";
import {
  DeliverablesAPI,
  type Deliverable,
} from "../../api/deliverables";
import { fileUrl } from "../../utils/fileUrl";

const OrdersManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [deliverablesByOrder, setDeliverablesByOrder] = useState<
    Record<string, Deliverable[]>
  >({});
  const [loadingDeliverables, setLoadingDeliverables] = useState<
    Record<string, boolean>
  >({});
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AdminAPI.orders().then(setOrders).catch(() => setOrders([]));
  }, []);

  const toggleOrder = async (orderId: string) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      return;
    }

    setSelectedOrderId(orderId);
    setError(null);

    if (!deliverablesByOrder[orderId]) {
      setLoadingDeliverables((prev) => ({ ...prev, [orderId]: true }));
      try {
        const files = await DeliverablesAPI.listForOrder(orderId);
        setDeliverablesByOrder((prev) => ({ ...prev, [orderId]: files }));
      } catch {
        setError("Failed to load deliverables for this order.");
      } finally {
        setLoadingDeliverables((prev) => ({
          ...prev,
          [orderId]: false,
        }));
      }
    }
  };

  const handleVerify = async (orderId: string, deliverableId: string) => {
    setVerifyingId(deliverableId);
    setError(null);
    try {
      const updated = await DeliverablesAPI.verify(deliverableId);
      setDeliverablesByOrder((prev) => ({
        ...prev,
        [orderId]: (prev[orderId] || []).map((d) =>
          d.id === deliverableId ? updated : d
        ),
      }));
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Failed to verify deliverable."
      );
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Orders management
      </h2>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-slate-600">
                Order ID
              </th>
              <th className="px-4 py-2 text-left font-semibold text-slate-600">
                Assignment
              </th>
              <th className="px-4 py-2 text-left font-semibold text-slate-600">
                Student
              </th>
              <th className="px-4 py-2 text-left font-semibold text-slate-600">
                Expert
              </th>
              <th className="px-4 py-2 text-left font-semibold text-slate-600">
                Status
              </th>
              <th className="px-4 py-2 text-right font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 text-slate-700">{o.id}</td>
                <td className="px-4 py-3 text-slate-700">
                  {o.assignment?.title ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {o.student?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {o.expert?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">{o.status}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleOrder(o.id)}
                    className="rounded-md border border-slate-200 px-3 py-1 text-[11px] font-medium text-indigo-700 hover:bg-slate-50"
                  >
                    {selectedOrderId === o.id
                      ? "Hide deliverables"
                      : "View deliverables"}
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-3 text-xs text-slate-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrderId && (
        <div className="mt-4 rounded-xl bg-white p-4 text-xs text-slate-700 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Deliverables for order {selectedOrderId}
          </h3>

          {loadingDeliverables[selectedOrderId] && (
            <p className="text-[11px] text-slate-500">
              Loading deliverables...
            </p>
          )}

          {!loadingDeliverables[selectedOrderId] &&
            (deliverablesByOrder[selectedOrderId] || []).length ===
              0 && (
              <p className="text-[11px] text-slate-500">
                No deliverables uploaded yet.
              </p>
            )}

          <div className="space-y-2">
            {(deliverablesByOrder[selectedOrderId] || []).map(
              (d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div>
                    <a
                      href={fileUrl(d.filePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-indigo-700 hover:underline"
                    >
                      {d.originalName}
                    </a>
                    <div className="text-[10px] text-slate-500">
                      Uploaded by: {d.uploader?.name ?? "Expert"} ·{" "}
                      {new Date(d.createdAt).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Verified:{" "}
                      {d.isVerified
                        ? `Yes${
                            d.verifiedAt
                              ? " at " +
                                new Date(
                                  d.verifiedAt
                                ).toLocaleString()
                              : ""
                          }`
                        : "No"}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <a
                      href={fileUrl(d.filePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View PDF
                    </a>
                    {!d.isVerified && (
                      <button
                        type="button"
                        onClick={() =>
                          handleVerify(selectedOrderId, d.id)
                        }
                        disabled={verifyingId === d.id}
                        className="rounded-md bg-emerald-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {verifyingId === d.id
                          ? "Verifying..."
                          : "Mark as verified"}
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagementPage;
