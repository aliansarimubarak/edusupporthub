import { useEffect, useState } from "react";
import type  { Assignment } from "../../api/assignments";
import { AssignmentsAPI } from "../../api/assignments";
import { OrdersAPI } from "../../api/orders";
import type { Order } from "../../api/orders";

const ExpertDashboardPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openAssignments, setOpenAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    OrdersAPI.listMine().then(setOrders).catch(() => setOrders([]));
    AssignmentsAPI.listOpen().then(setOpenAssignments).catch(() => setOpenAssignments([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome back, Expert 👨‍🏫
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Active orders</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {orders.length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Open assignments</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {openAssignments.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboardPage;
