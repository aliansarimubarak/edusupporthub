// import { useEffect, useState } from "react";
// import type  { Assignment } from "../../api/assignments";
// import { AssignmentsAPI } from "../../api/assignments";
// import { OrdersAPI } from "../../api/orders";
// import type { Order } from "../../api/orders";

// const ExpertDashboardPage = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [openAssignments, setOpenAssignments] = useState<Assignment[]>([]);

//   useEffect(() => {
//     OrdersAPI.listMine().then(setOrders).catch(() => setOrders([]));
//     AssignmentsAPI.listOpen().then(setOpenAssignments).catch(() => setOpenAssignments([]));
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold text-slate-900">
//         Welcome back, Expert 👨‍🏫
//       </h1>

//       <div className="grid gap-4 md:grid-cols-3">
//         <div className="rounded-xl bg-white p-4 shadow-sm">
//           <p className="text-xs text-slate-500">Active orders</p>
//           <p className="mt-2 text-2xl font-semibold text-slate-900">
//             {orders.length}
//           </p>
//         </div>
//         <div className="rounded-xl bg-white p-4 shadow-sm">
//           <p className="text-xs text-slate-500">Open assignments</p>
//           <p className="mt-2 text-2xl font-semibold text-slate-900">
//             {openAssignments.length}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpertDashboardPage;









// src/pages/expert/ExpertDashboardPage.tsx

// import { useEffect, useMemo, useState } from "react";
// import { OrdersAPI, Order } from "../../api/orders";
// import { AssignmentsAPI, Assignment } from "../../api/assignments";

import { useEffect, useMemo, useState } from "react";
import type  { Assignment } from "../../api/assignments";
import { AssignmentsAPI } from "../../api/assignments";
import { OrdersAPI } from "../../api/orders";
import type { Order } from "../../api/orders";

const ExpertDashboardPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openAssignments, setOpenAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      OrdersAPI.listMine().catch(() => []),
      AssignmentsAPI.listOpen().catch(() => []),
    ])
      .then(([ordersData, assignmentsData]) => {
        setOrders(ordersData as Order[]);
        setOpenAssignments(assignmentsData as Assignment[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeOrdersCount = useMemo(
    () =>
      orders.filter(
        (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
      ).length,
    [orders]
  );

  const completedOrdersCount = useMemo(
    () => orders.filter((o) => o.status === "COMPLETED").length,
    [orders]
  );

  const totalEarnings = useMemo(
    () =>
      orders
        .filter((o) => o.status === "COMPLETED")
        .reduce((sum, o) => sum + (o.agreedPrice || 0), 0),
    [orders]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Expert dashboard
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Overview of your workload, performance, and new opportunities on
          EduSupportHub.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Active orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {activeOrdersCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Completed orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {completedOrdersCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Total earnings
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            ${totalEarnings.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Based on completed orders
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Open assignments
          </p>
          <p className="mt-2 text-2xl font-semibold text-indigo-600">
            {openAssignments.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Available to send offers
          </p>
        </div>
      </div>

      {/* Lists */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent orders
            </h2>
            <a
              href="/expert/orders"
              className="text-[11px] text-indigo-600 hover:underline"
            >
              View all
            </a>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-slate-500">
              You have no orders yet. Once a student accepts your offer, it will
              appear here.
            </p>
          ) : (
            <ul className="divide-y text-xs">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="py-2">
                  <div className="flex justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900">
                        {o.assignment?.title ?? "Untitled assignment"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {o.student?.name ?? "Student"} ·{" "}
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-slate-700">
                        {o.status}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ${o.agreedPrice}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Open assignments */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              New assignments to bid on
            </h2>
            <a
              href="/expert/assignments"
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Browse all
            </a>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500">Loading...</p>
          ) : openAssignments.length === 0 ? (
            <p className="text-xs text-slate-500">
              No open assignments at the moment. Check back soon.
            </p>
          ) : (
            <ul className="divide-y text-xs">
              {openAssignments.slice(0, 5).map((a) => (
                <li key={a.id} className="py-2">
                  <div className="flex justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900">
                        {a.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {a.subject} · {a.academicLevel}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      {new Date(a.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboardPage;
