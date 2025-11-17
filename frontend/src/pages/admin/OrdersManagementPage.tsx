import { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin";
import type { Order } from "../../api/orders";

const OrdersManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    AdminAPI.orders().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">
        Orders management
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        View all orders on EduSupportHub. You can extend this with dispute
        resolution tools later.
      </p>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Assignment</th>
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2">Expert</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-2">{o.id}</td>
                <td className="px-4 py-2">{o.assignment?.title}</td>
                <td className="px-4 py-2">{o.student?.name}</td>
                <td className="px-4 py-2">{o.expert?.name}</td>
                <td className="px-4 py-2">{o.status}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-3 text-xs text-slate-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManagementPage;
