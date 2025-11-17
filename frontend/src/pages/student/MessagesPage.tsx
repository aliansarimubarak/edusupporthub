import { useEffect, useState } from "react";
import type { Order } from "../../api/orders";
import { OrdersAPI } from "../../api/orders";
import type { Message } from "../../api/messages";
import { MessagesAPI } from "../../api/messages";

const MessagesPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    OrdersAPI.listMine().then((o) => {
      setOrders(o);
      if (o.length > 0) setSelectedOrderId(o[0].id);
    });
  }, []);

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

  return (
    <div className="grid gap-4 md:grid-cols-[220px,1fr]">
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <h2 className="mb-2 text-xs font-semibold text-slate-900">
          Orders
        </h2>
        <div className="space-y-1 text-xs">
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelectedOrderId(o.id)}
              className={`w-full rounded px-2 py-1 text-left ${
                selectedOrderId === o.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="font-medium">{o.assignment?.title}</div>
              <div className="text-[11px] text-slate-500">
                {o.id} · {o.status}
              </div>
            </button>
          ))}
          {orders.length === 0 && (
            <p className="text-[11px] text-slate-500">
              You have no orders yet.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col rounded-xl bg-white p-3 shadow-sm">
        <div className="mb-2 border-b pb-2 text-xs text-slate-600">
          {selectedOrderId ? (
            <>Chat for order {selectedOrderId}</>
          ) : (
            <>Select an order to see messages</>
          )}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto rounded bg-slate-50 p-2 text-xs">
          {loadingMessages && <p className="text-slate-500">Loading messages...</p>}
          {!loadingMessages && messages.length === 0 && (
            <p className="text-slate-500">No messages yet.</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className="rounded bg-white px-2 py-1 shadow-sm">
              <div className="text-[11px] font-medium text-slate-700">
                {m.sender?.name ?? "User"}
              </div>
              <div>{m.text}</div>
              <div className="mt-1 text-[10px] text-slate-400">
                {new Date(m.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <input
            placeholder="Type a message..."
            className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSend}
            disabled={!selectedOrderId}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
