// import { useEffect, useState } from "react";
// import type { Order } from "../../api/orders";
// import { OrdersAPI } from "../../api/orders";
// import type { Message } from "../../api/messages";
// import { MessagesAPI } from "../../api/messages";

// const MessagesPage = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loadingMessages, setLoadingMessages] = useState(false);

//   useEffect(() => {
//     OrdersAPI.listMine().then((o) => {
//       setOrders(o);
//       if (o.length > 0) setSelectedOrderId(o[0].id);
//     });
//   }, []);

//   useEffect(() => {
//     if (!selectedOrderId) return;
//     setLoadingMessages(true);
//     MessagesAPI.listForOrder(selectedOrderId)
//       .then(setMessages)
//       .finally(() => setLoadingMessages(false));
//   }, [selectedOrderId]);

//   const handleSend = async () => {
//     if (!selectedOrderId || !newMessage.trim()) return;
//     const text = newMessage.trim();
//     setNewMessage("");
//     const msg = await MessagesAPI.send(selectedOrderId, text);
//     setMessages((prev) => [...prev, msg]);
//   };

//   return (
//     <div className="grid gap-4 md:grid-cols-[220px,1fr]">
//       <div className="rounded-xl bg-white p-3 shadow-sm">
//         <h2 className="mb-2 text-xs font-semibold text-slate-900">
//           Orders
//         </h2>
//         <div className="space-y-1 text-xs">
//           {orders.map((o) => (
//             <button
//               key={o.id}
//               onClick={() => setSelectedOrderId(o.id)}
//               className={`w-full rounded px-2 py-1 text-left ${
//                 selectedOrderId === o.id
//                   ? "bg-indigo-50 text-indigo-700"
//                   : "hover:bg-slate-50"
//               }`}
//             >
//               <div className="font-medium">{o.assignment?.title}</div>
//               <div className="text-[11px] text-slate-500">
//                 {o.id} · {o.status}
//               </div>
//             </button>
//           ))}
//           {orders.length === 0 && (
//             <p className="text-[11px] text-slate-500">
//               You have no orders yet.
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col rounded-xl bg-white p-3 shadow-sm">
//         <div className="mb-2 border-b pb-2 text-xs text-slate-600">
//           {selectedOrderId ? (
//             <>Chat for order {selectedOrderId}</>
//           ) : (
//             <>Select an order to see messages</>
//           )}
//         </div>

//         <div className="flex-1 space-y-2 overflow-y-auto rounded bg-slate-50 p-2 text-xs">
//           {loadingMessages && <p className="text-slate-500">Loading messages...</p>}
//           {!loadingMessages && messages.length === 0 && (
//             <p className="text-slate-500">No messages yet.</p>
//           )}
//           {messages.map((m) => (
//             <div key={m.id} className="rounded bg-white px-2 py-1 shadow-sm">
//               <div className="text-[11px] font-medium text-slate-700">
//                 {m.sender?.name ?? "User"}
//               </div>
//               <div>{m.text}</div>
//               <div className="mt-1 text-[10px] text-slate-400">
//                 {new Date(m.createdAt).toLocaleString()}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-2 flex gap-2">
//           <input
//             placeholder="Type a message..."
//             className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <button
//             onClick={handleSend}
//             disabled={!selectedOrderId}
//             className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagesPage;



import { useEffect, useState } from "react";
import { OrdersAPI } from "../../api/orders";
import type { Order } from "../../api/orders";
import { MessagesAPI } from "../../api/messages";
import type { Message } from "../../api/messages";
import { useAuth } from "../../context/AuthContext";

const MessagesPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [search, setSearch] = useState("");

  // Load all orders for the current user (student or expert)
  useEffect(() => {
    setLoadingOrders(true);
    OrdersAPI.listMine()
      .then((data) => {
        setOrders(data);
        if (data.length > 0) {
          setSelectedOrderId(data[0].id);
        }
      })
      .finally(() => setLoadingOrders(false));
  }, []);

  // Load messages when selected order changes
  useEffect(() => {
    if (!selectedOrderId) return;
    setLoadingMessages(true);
    MessagesAPI.listForOrder(selectedOrderId)
      .then(setMessages)
      .finally(() => setLoadingMessages(false));
  }, [selectedOrderId]);

  const handleSend = async () => {
    if (!selectedOrderId || !newMessage.trim()) return;
    const text = newMessage.trim();
    setNewMessage("");
    const msg = await MessagesAPI.send(selectedOrderId, text);
    setMessages((prev) => [...prev, msg]);
  };

  const filteredOrders = orders.filter((o) => {
    const title = o.assignment?.title ?? "";
    const partner =
      user?.role === "STUDENT"
        ? o.expert?.name ?? ""
        : o.student?.name ?? "";
    const q = search.toLowerCase();
    return (
      title.toLowerCase().includes(q) ||
      partner.toLowerCase().includes(q)
    );
  });

  const getChatTitle = (order: Order | undefined) => {
    if (!order) return "Select a conversation";
    const partner =
      user?.role === "STUDENT"
        ? order.expert?.name ?? "Expert"
        : order.student?.name ?? "Student";
    return partner;
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="h-[70vh] rounded-xl bg-white shadow-sm overflow-hidden flex">
      {/* LEFT COLUMN – chat list like WhatsApp */}
      <aside className="w-72 border-r bg-slate-50 flex flex-col">
        {/* Top bar */}
        <div className="h-14 flex items-center px-3 border-b bg-slate-100">
          <div className="text-sm font-semibold text-slate-800">
            Messages
          </div>
        </div>

        {/* Search bar */}
        <div className="px-3 py-2 border-b bg-slate-50">
          <input
            type="text"
            placeholder="Search or select an order"
            className="w-full rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {loadingOrders ? (
            <p className="px-3 py-4 text-xs text-slate-500">
              Loading conversations…
            </p>
          ) : filteredOrders.length === 0 ? (
            <p className="px-3 py-4 text-xs text-slate-500">
              No conversations yet.
            </p>
          ) : (
            filteredOrders.map((o) => {
              const active = o.id === selectedOrderId;
              const partner =
                user?.role === "STUDENT"
                  ? o.expert?.name ?? "Expert"
                  : o.student?.name ?? "Student";

              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`w-full flex flex-col items-start px-3 py-2 text-left text-xs border-b hover:bg-slate-100 ${
                    active ? "bg-slate-200" : ""
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-medium text-slate-900 line-clamp-1">
                      {partner}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-600 line-clamp-1">
                    {o.assignment?.title}
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    Status: {o.status}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* RIGHT COLUMN – conversation */}
      <section className="flex-1 flex flex-col bg-slate-100">
        {/* Chat header */}
        <div className="h-14 flex items-center justify-between border-b bg-slate-100 px-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {getChatTitle(selectedOrder)}
            </span>
            {selectedOrder && (
              <span className="text-[11px] text-slate-500">
                Order: {selectedOrder.id} ·{" "}
                {selectedOrder.assignment?.title ?? ""}
              </span>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-slate-200/70 p-4 space-y-1">
          {(!selectedOrderId || loadingMessages) && (
            <p className="text-xs text-slate-600">
              {loadingMessages
                ? "Loading messages…"
                : "Select a conversation to start messaging."}
            </p>
          )}

          {!loadingMessages &&
            selectedOrderId &&
            messages.map((m) => {
              const isMine = m.sender?.id === user?.id;

              return (
                <div
                  key={m.id}
                  className={`flex w-full mb-1 ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative max-w-[70%] px-3 py-2 text-xs shadow-sm rounded-lg
                      ${
                        isMine
                          ? "bg-green-200 text-black"
                          : "bg-white text-black"
                      }
                    `}
                  >
                    {/* Message text */}
                    <div className="whitespace-pre-wrap break-words leading-snug">
                      {m.text}
                    </div>

                    {/* Timestamp */}
                    <div className="mt-1 text-[10px] text-gray-500 text-right">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Bubble tail */}
                    {!isMine ? (
                      <span className="absolute left-[-6px] top-2 w-3 h-3 bg-white rounded-bl-lg rotate-45" />
                    ) : (
                      <span className="absolute right-[-6px] top-2 w-3 h-3 bg-green-200 rounded-br-lg rotate-45" />
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Input bar */}
        <div className="h-16 flex items-center gap-3 border-t bg-slate-100 px-4">
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-lg">
            🙂
          </div>
          <input
            type="text"
            placeholder={
              selectedOrderId
                ? "Type a message"
                : "Select a conversation to start messaging"
            }
            disabled={!selectedOrderId}
            className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-200"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!selectedOrderId || !newMessage.trim()}
            className="h-9 rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
};

export default MessagesPage;
