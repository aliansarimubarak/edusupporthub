// //src/pages/studen/MyOrderPage.tsx
// import { useEffect, useState } from "react";
// import { OrdersAPI } from "../../api/orders";
// import type { Order } from "../../api/orders";
// import { AssignmentsAPI } from "../../api/assignments";
// import type { Assignment } from "../../api/assignments";
// import { Link } from "react-router-dom";


// const MyOrdersPage = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([
//       OrdersAPI.listMine().catch(() => []),
//       AssignmentsAPI.listMine().catch(() => []),
//     ])
//       .then(([ordersData, assignmentsData]) => {
//         setOrders(ordersData as Order[]);
//         setAssignments(assignmentsData as Assignment[]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="space-y-8">
//       <div>
//         <h2 className="mb-2 text-lg font-semibold text-slate-900">
//           My assignments
//         </h2>
//         <p className="mb-4 text-xs text-slate-500">
//           These are the assignments you have posted. They will become orders
//           after you accept an expert&apos;s offer.
//         </p>

//         {loading ? (
//           <p className="text-xs text-slate-500">Loading...</p>
//         ) : (
//           <div className="overflow-hidden rounded-xl bg-white shadow-sm">
//             <table className="min-w-full text-left text-xs">
//               <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
//                 <tr>
//                   <th className="px-4 py-2">Title</th>
//                   <th className="px-4 py-2">Subject</th>
//                   <th className="px-4 py-2">Level</th>
//                   <th className="px-4 py-2">Deadline</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {assignments.map((a) => (
//                   <tr key={a.id} className="border-t">
//                     <td className="px-4 py-2">{a.title}</td>
//                     <td className="px-4 py-2">{a.subject}</td>
//                     <td className="px-4 py-2">{a.academicLevel}</td>
//                     <td className="px-4 py-2">
//                       {new Date(a.deadline).toLocaleString()}
//                     </td>
//                     <td className="px-4 py-2">{a.status}</td>
//                     <td className="px-4 py-2">
//                       <a
//                         href={`/student/assignments/${a.id}/offers`}
//                         className="text-xs text-indigo-600 hover:underline"
//                       >
//                         View offers
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//                 {assignments.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-4 py-3 text-xs text-slate-500"
//                     >
//                       You haven&apos;t posted any assignments yet.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div>
//         <h2 className="mb-2 text-lg font-semibold text-slate-900">
//           My orders
//         </h2>
//         <p className="mb-4 text-xs text-slate-500">
//           Orders appear here once you accept an offer from an expert on one of
//           your assignments.
//         </p>

//         {loading ? (
//           <p className="text-xs text-slate-500">Loading...</p>
//         ) : (
//           <div className="overflow-hidden rounded-xl bg-white shadow-sm">
//             <table className="min-w-full text-left text-xs">
//               <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
//                 <tr>
//                   <th className="px-4 py-2">Order</th>
//                   <th className="px-4 py-2">Title</th>
//                   <th className="px-4 py-2">Expert</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((o) => (
//                   <tr key={o.id} className="border-t">
//                     <td className="px-4 py-2">{o.id}</td>
//                     <td className="px-4 py-2">{o.assignment?.title}</td>
//                     <td className="px-4 py-2">{o.expert?.name}</td>
//                     <td className="px-4 py-2">{o.status}</td>
//                     <td className="px-4 py-2">${o.agreedPrice}</td>
//                   </tr>
//                 ))}
//                 {orders.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-4 py-3 text-xs text-slate-500"
//                     >
//                       No orders yet. Once you accept an expert&apos;s offer,
//                       the order will show up here.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyOrdersPage;







// src/pages/student/MyOrdersPage.tsx
import { useEffect, useState } from "react";
import { OrdersAPI } from "../../api/orders";
import type { Order } from "../../api/orders";
import { AssignmentsAPI } from "../../api/assignments";
import type { Assignment } from "../../api/assignments";
import { Link } from "react-router-dom";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      OrdersAPI.listMine().catch(() => []),
      AssignmentsAPI.listMine().catch(() => []),
    ])
      .then(([ordersData, assignmentsData]) => {
        setOrders(ordersData as Order[]);
        setAssignments(assignmentsData as Assignment[]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* ASSIGNMENTS TABLE */}
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          My assignments
        </h2>
        <p className="mb-4 text-xs text-slate-500">
          These are the assignments you have posted. They will become orders
          after you accept an expert&apos;s offer.
        </p>

        {loading ? (
          <p className="text-xs text-slate-500">Loading...</p>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Level</th>
                  <th className="px-4 py-2">Deadline</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-4 py-2">{a.title}</td>
                    <td className="px-4 py-2">{a.subject}</td>
                    <td className="px-4 py-2">{a.academicLevel}</td>
                    <td className="px-4 py-2">
                      {new Date(a.deadline).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{a.status}</td>
                    <td className="px-4 py-2">
                      <Link
                        to={`/student/assignments/${a.id}/offers`}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        View offers
                      </Link>
                    </td>
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr>
                    <td
                      colSpan={6} // ✅ we have 6 columns above
                      className="px-4 py-3 text-xs text-slate-500"
                    >
                      You haven&apos;t posted any assignments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDERS TABLE */}
      <div>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          My orders
        </h2>
        <p className="mb-4 text-xs text-slate-500">
          Orders appear here once you accept an offer from an expert on one of
          your assignments.
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
                  <th className="px-4 py-2">Expert</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Actions</th> {/* ✅ new column */}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-4 py-2">{o.id}</td>
                    <td className="px-4 py-2">{o.assignment?.title}</td>
                    <td className="px-4 py-2">{o.expert?.name}</td>
                    <td className="px-4 py-2">{o.status}</td>
                    <td className="px-4 py-2">${o.agreedPrice}</td>
                    <td className="px-4 py-2">
                      <Link
                        to={`/student/orders/${o.id}`}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-3 text-xs text-slate-500"
                    >
                      No orders yet. Once you accept an expert&apos;s offer,
                      the order will show up here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;

