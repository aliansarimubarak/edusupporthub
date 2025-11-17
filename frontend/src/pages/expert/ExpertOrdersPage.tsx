import { useEffect, useState } from "react";
import { OrdersAPI } from "../../api/orders";
import type { Order } from "../../api/orders";

const ExpertOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrdersAPI.listMine()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">My orders</h2>
      <p className="mb-4 text-xs text-slate-500">
        Orders you are currently working on or have completed.
      </p>

      {loading ? (
        <p className="text-xs text-slate-500">Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-2">{o.id}</td>
                  <td className="px-4 py-2">{o.assignment?.title}</td>
                  <td className="px-4 py-2">{o.student?.name}</td>
                  <td className="px-4 py-2">{o.status}</td>
                  <td className="px-4 py-2">${o.agreedPrice}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-xs text-slate-500"
                  >
                    You have no orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpertOrdersPage;
