import { useEffect, useState } from "react";
import type  { Assignment } from "../../api/assignments";
import { AssignmentsAPI } from "../../api/assignments";
import { OrdersAPI } from "../../api/orders";
import type { Order } from "../../api/orders";

const StudentDashboardPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    AssignmentsAPI.listMine().then(setAssignments).catch(() => setAssignments([]));
    OrdersAPI.listMine().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome back 👋
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">My assignments</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {assignments.length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">My orders</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {orders.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
