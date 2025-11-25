
import { DeliverablesAPI } from "../../api/deliverables";
import type{ Deliverable } from "../../api/deliverables";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { OrdersAPI } from "../../api/orders";
import type { Order } from "../../api/orders";


const ExpertOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [deliverables, setDeliverables] = useState<Record<string, Deliverable[]>>(
    {}
  );

  useEffect(() => {
    OrdersAPI.listMine()
      .then(async (o) => {
        setOrders(o);
        // preload deliverables for each order
        const map: Record<string, Deliverable[]> = {};
        for (const order of o) {
          const files = await DeliverablesAPI.listForOrder(order.id).catch(
            () => []
          );
          map[order.id] = files;
        }
        setDeliverables(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    orderId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFor(orderId);
    try {
      const uploaded = await DeliverablesAPI.upload(orderId, file, "FINAL");
      setDeliverables((prev) => ({
        ...prev,
        [orderId]: [...(prev[orderId] || []), uploaded],
      }));
      alert("File uploaded for this order.");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to upload deliverable");
    } finally {
      setUploadingFor(null);
      e.target.value = ""; // reset input
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        My orders
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Upload final work to each order. Admin can verify it, and students can
        then download the files.
      </p>

      {loading ? (
        <p className="text-xs text-slate-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl bg-white p-4 shadow-sm text-xs"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">
                    {o.assignment?.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Student: {o.student?.name ?? "N/A"} · Status: {o.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500">
                    Price: ${o.agreedPrice}
                  </div>
                  <label className="mt-1 inline-block cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-indigo-700">
                    {uploadingFor === o.id ? "Uploading..." : "Upload final file"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, o.id)}
                      disabled={uploadingFor === o.id}
                    />
                  </label>
                </div>
              </div>

              {/* existing deliverables */}
              <div className="mt-3 border-t pt-2 text-[11px] text-slate-600">
                <div className="font-semibold mb-1">Deliverables:</div>
                {(deliverables[o.id] || []).length === 0 ? (
                  <div className="text-slate-400">
                    No files uploaded yet.
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {(deliverables[o.id] || []).map((d) => (
                      <li key={d.id} className="flex justify-between gap-2">
                        <a
                          href={d.filePath}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          {d.originalName}
                        </a>
                        <span className="text-slate-400">
                          {d.isVerified ? "Verified ✅" : "Pending verification"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-xs text-slate-500">
              You have no orders yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertOrdersPage;
