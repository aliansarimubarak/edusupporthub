// import { useEffect, useState } from "react";
// import type  { Assignment } from "../../api/assignments";
// import { AssignmentsAPI } from "../../api/assignments";
// import { OffersAPI } from "../../api/offers";

// const AvailableAssignmentsPage = () => {
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [sendingFor, setSendingFor] = useState<string | null>(null);

//   useEffect(() => {
//     AssignmentsAPI.listOpen().then(setAssignments).catch(() => setAssignments([]));
//   }, []);

//   const handleQuickOffer = async (assignmentId: string) => {
//     const priceStr = prompt("Proposed price (USD):", "50");
//     const daysStr = prompt("Delivery time (days):", "3");
//     const msg = prompt("Short message to the student:", "I can help with this task.");

//     if (!priceStr || !daysStr || !msg) return;

//     const price = Number(priceStr);
//     const deliveryDays = Number(daysStr);
//     if (!price || !deliveryDays) return;

//     setSendingFor(assignmentId);
//     try {
//       await OffersAPI.create({ assignmentId, price, deliveryDays, message: msg });
//       alert("Offer sent!");
//     } catch (err: any) {
//       alert(err?.response?.data?.error || "Failed to send offer");
//     } finally {
//       setSendingFor(null);
//     }
//   };

//   return (
//     <div>
//       <h2 className="mb-2 text-lg font-semibold text-slate-900">
//         Available assignments
//       </h2>
//       <p className="mb-4 text-xs text-slate-500">
//         Browse open student requests and send offers.
//       </p>

//       <div className="space-y-3">
//         {assignments.map((a) => (
//           <div
//             key={a.id}
//             className="rounded-xl bg-white p-4 shadow-sm"
//           >
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <h3 className="text-sm font-semibold text-slate-900">
//                   {a.title}
//                 </h3>
//                 <p className="mt-1 text-xs text-slate-600 line-clamp-3">
//                   {a.description}
//                 </p>
//                 <p className="mt-2 text-[11px] text-slate-500">
//                   Subject: {a.subject} · Level: {a.academicLevel}
//                 </p>
//               </div>
//               <button
//                 onClick={() => handleQuickOffer(a.id)}
//                 disabled={sendingFor === a.id}
//                 className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
//               >
//                 {sendingFor === a.id ? "Sending..." : "Send offer"}
//               </button>
//             </div>
//           </div>
//         ))}
//         {assignments.length === 0 && (
//           <p className="text-xs text-slate-500">
//             No open assignments at the moment.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableAssignmentsPage;






// import { useEffect, useState } from "react";
// import type { FormEvent } from "react";
// import { AssignmentsAPI } from "../../api/assignments";
// import type { Assignment } from "../../api/assignments";
// import { OffersAPI } from "../../api/offers";

// const AvailableAssignmentsPage = () => {
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [selected, setSelected] = useState<Assignment | null>(null);

//   const [price, setPrice] = useState("");
//   const [deliveryDays, setDeliveryDays] = useState("");
//   const [message, setMessage] = useState("");

//   const [sending, setSending] = useState(false);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     AssignmentsAPI.listOpen()
//       .then((data) => {
//         setAssignments(data);
//         if (data.length > 0) {
//           setSelected(data[0]);
//         }
//       })
//       .catch(() => setAssignments([]));
//   }, []);

//   const handleSelect = (assignment: Assignment) => {
//     setSelected(assignment);
//     setSuccess(null);
//     setError(null);

//     // Prefill price based on budget if available
//     if (assignment.budgetMin && assignment.budgetMax) {
//       const mid = (assignment.budgetMin + assignment.budgetMax) / 2;
//       setPrice(String(Math.round(mid)));
//     } else {
//       setPrice("");
//     }
//     setDeliveryDays("3");
//     setMessage("");
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!selected) return;

//     setSending(true);
//     setSuccess(null);
//     setError(null);

//     const priceNum = Number(price);
//     const daysNum = Number(deliveryDays);

//     if (!priceNum || !daysNum) {
//       setError("Please enter a valid price and delivery time.");
//       setSending(false);
//       return;
//     }

//     try {
//       await OffersAPI.create({
//         assignmentId: selected.id,
//         price: priceNum,
//         deliveryDays: daysNum,
//         message,
//       });
//       setSuccess("Offer sent successfully to the student.");
//       setMessage("");
//     } catch (err: any) {
//       setError(err?.response?.data?.error || "Failed to send offer. Try again.");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="grid gap-4 md:grid-cols-[280px,1fr]">
//       {/* LEFT: assignments list */}
//       <div className="rounded-xl bg-white p-3 shadow-sm">
//         <h2 className="mb-2 text-sm font-semibold text-slate-900">
//           Available assignments
//         </h2>
//         <p className="mb-3 text-[11px] text-slate-500">
//           Select an assignment to view details and send a tailored offer.
//         </p>

//         <div className="space-y-2 max-h-[70vh] overflow-y-auto">
//           {assignments.map((a) => {
//             const isActive = selected?.id === a.id;
//             return (
//               <button
//                 key={a.id}
//                 onClick={() => handleSelect(a)}
//                 className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
//                   isActive
//                     ? "border-indigo-500 bg-indigo-50"
//                     : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
//                 }`}
//               >
//                 <div className="font-semibold text-slate-900 line-clamp-1">
//                   {a.title}
//                 </div>
//                 <div className="mt-1 text-[11px] text-slate-500">
//                   {a.subject} · {a.academicLevel}
//                 </div>
//                 <div className="mt-1 text-[11px] text-slate-500">
//                   Deadline:{" "}
//                   {new Date(a.deadline).toLocaleString(undefined, {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                   })}
//                 </div>
//                 {a.budgetMin != null && a.budgetMax != null && (
//                   <div className="mt-1 text-[11px] text-emerald-600">
//                     Budget: ${a.budgetMin} – ${a.budgetMax}
//                   </div>
//                 )}
//               </button>
//             );
//           })}

//           {assignments.length === 0 && (
//             <p className="text-[11px] text-slate-500">
//               No open assignments at the moment. Check back soon.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* RIGHT: details + offer form */}
//       <div className="rounded-xl bg-white p-4 shadow-sm flex flex-col gap-4">
//         {selected ? (
//           <>
//             {/* Assignment details */}
//             <div>
//               <h2 className="text-sm font-semibold text-slate-900 mb-1">
//                 {selected.title}
//               </h2>
//               <p className="text-xs text-slate-600 mb-2 whitespace-pre-wrap">
//                 {selected.description}
//               </p>
//               <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
//                 <span>Subject: {selected.subject}</span>
//                 <span>Level: {selected.academicLevel}</span>
//                 <span>
//                   Deadline:{" "}
//                   {new Date(selected.deadline).toLocaleString(undefined, {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                   })}
//                 </span>
//                 {selected.budgetMin != null && selected.budgetMax != null && (
//                   <span className="text-emerald-600">
//                     Budget: ${selected.budgetMin} – ${selected.budgetMax}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="h-px bg-slate-100" />

//             {/* Offer form */}
//             <div>
//               <h3 className="text-sm font-semibold text-slate-900 mb-2">
//                 Send your offer
//               </h3>
//               <p className="text-[11px] text-slate-500 mb-3">
//                 Propose a fair price and realistic delivery time. Add a short
//                 message explaining your approach so the student trusts you.
//               </p>

//               {success && (
//                 <div className="mb-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
//                   {success}
//                 </div>
//               )}
//               {error && (
//                 <div className="mb-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-3 text-xs">
//                 <div className="grid gap-3 md:grid-cols-2">
//                   <div>
//                     <label className="mb-1 block font-medium text-slate-700">
//                       Proposed price (USD)
//                     </label>
//                     <input
//                       type="number"
//                       min={1}
//                       value={price}
//                       onChange={(e) => setPrice(e.target.value)}
//                       required
//                       className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block font-medium text-slate-700">
//                       Delivery time (days)
//                     </label>
//                     <input
//                       type="number"
//                       min={1}
//                       value={deliveryDays}
//                       onChange={(e) => setDeliveryDays(e.target.value)}
//                       required
//                       className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="mb-1 block font-medium text-slate-700">
//                     Short message to the student
//                   </label>
//                   <textarea
//                     rows={4}
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Explain how you will approach this task, your expertise in the subject, and any clarifying questions."
//                     className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={sending}
//                   className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
//                 >
//                   {sending ? "Sending offer..." : "Send offer"}
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           <div className="flex flex-1 items-center justify-center text-xs text-slate-500">
//             Select an assignment from the left to view details and send an
//             offer.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvailableAssignmentsPage;








import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AssignmentsAPI } from "../../api/assignments";
import type { Assignment } from "../../api/assignments";
import { OffersAPI } from "../../api/offers";


// import { useEffect, useState, FormEvent } from "react";
// import { AssignmentsAPI, Assignment } from "../../api/assignments";
// import { OffersAPI } from "../../api/offers";

const AvailableAssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selected, setSelected] = useState<Assignment | null>(null);

  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AssignmentsAPI.listOpen()
      .then((data) => {
        setAssignments(data);
        if (data.length > 0) {
          setSelected(data[0]);
          prefillFromAssignment(data[0]);
        }
      })
      .catch(() => setAssignments([]));
  }, []);

  const prefillFromAssignment = (a: Assignment) => {
    if (a.budgetMin != null && a.budgetMax != null) {
      const mid = (a.budgetMin + a.budgetMax) / 2;
      setPrice(String(Math.round(mid)));
    } else {
      setPrice("");
    }
    setDeliveryDays("3");
    setMessage("");
    setSuccess(null);
    setError(null);
  };

  const handleSelect = (assignment: Assignment) => {
    setSelected(assignment);
    prefillFromAssignment(assignment);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setSending(true);
    setSuccess(null);
    setError(null);

    const priceNum = Number(price);
    const daysNum = Number(deliveryDays);

    if (!priceNum || !daysNum) {
      setError("Please enter a valid price and delivery time.");
      setSending(false);
      return;
    }

    try {
      await OffersAPI.create({
        assignmentId: selected.id,
        price: priceNum,
        deliveryDays: daysNum,
        message,
      });
      setSuccess("Offer sent successfully to the student.");
      setMessage("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to send offer. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Available assignments
        </h1>
        <p className="text-xs text-slate-500">
          Browse student requests below. Select one to view full details and send a
          tailored offer.
        </p>
      </div>

      {/* 1) ASSIGNMENTS LIST (vertical) */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">
          All open assignments
        </h2>

        <div className="space-y-2 max-h-[50vh] overflow-y-auto text-xs">
          {assignments.map((a) => {
            const isActive = selected?.id === a.id;
            return (
              <button
                key={a.id}
                onClick={() => handleSelect(a)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                  isActive
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {a.title}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {a.subject} · {a.academicLevel}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Deadline:{" "}
                      {new Date(a.deadline).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                  {a.budgetMin != null && a.budgetMax != null && (
                    <div className="text-[11px] text-emerald-600 whitespace-nowrap">
                      ${a.budgetMin} – ${a.budgetMax}
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {assignments.length === 0 && (
            <p className="text-[11px] text-slate-500">
              No open assignments at the moment. Check back later.
            </p>
          )}
        </div>
      </div>

      {/* 2) SEND OFFER SECTION (FULL INFO + FORM) */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        {selected ? (
          <>
            {/* FULL ASSIGNMENT INFO */}
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Assignment details
            </h2>

            <div className="mb-3 text-xs text-slate-700 space-y-2">
              <div>
                <span className="font-semibold">Title:</span> {selected.title}
              </div>

              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1 whitespace-pre-wrap">
                  {selected.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-[11px] text-slate-600">
                <span>
                  <span className="font-semibold">Subject:</span>{" "}
                  {selected.subject}
                </span>
                <span>
                  <span className="font-semibold">Academic level:</span>{" "}
                  {selected.academicLevel}
                </span>
                <span>
                  <span className="font-semibold">Deadline:</span>{" "}
                  {new Date(selected.deadline).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <div className="text-[11px]">
                <span className="font-semibold">Budget:</span>{" "}
                {selected.budgetMin != null && selected.budgetMax != null ? (
                  <span className="text-emerald-600">
                    ${selected.budgetMin} – ${selected.budgetMax}
                  </span>
                ) : (
                  <span className="text-slate-500">Not specified</span>
                )}
              </div>

              <div className="text-[11px] text-slate-400">
                Assignment ID: {selected.id}
              </div>
            </div>

            <div className="h-px bg-slate-100 my-3" />

            {/* OFFER FORM */}
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Send your offer
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Propose a realistic price and delivery time. A clear, friendly
              message increases your chances of being selected.
            </p>

            {success && (
              <div className="mb-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-slate-700">
                    Proposed price (USD)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700">
                    Delivery time (days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    required
                    className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  Message to the student
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain your experience with this subject, how you will approach the task, and ask any clarifying questions."
                  className="w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {sending ? "Sending offer..." : "Send offer"}
              </button>
            </form>
          </>
        ) : (
          <p className="text-xs text-slate-500">
            Select an assignment above to see full details and send an offer.
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailableAssignmentsPage;
