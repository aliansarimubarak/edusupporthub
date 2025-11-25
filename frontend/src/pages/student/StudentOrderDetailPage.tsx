
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OrdersAPI } from "../../api/orders";
import { DeliverablesAPI } from "../../api/deliverables";
import { MessagesAPI } from "../../api/messages";
import type { Order } from "../../api/orders";
import type { Deliverable } from "../../api/deliverables";
import type { Message } from "../../api/messages";
import { fileUrl } from "../../utils/fileUrl";

const StudentOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing order id.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setError(null);
        const [orderData, files, msgs] = await Promise.all([
          OrdersAPI.getById(id),
          DeliverablesAPI.listForOrder(id),
          MessagesAPI.listForOrder(id),
        ]);
        setOrder(orderData);
        setDeliverables(files);
        setMessages(msgs);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.error || "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSendMessage = async () => {
    if (!id || !newMessage.trim()) return;
    const text = newMessage.trim();
    setNewMessage("");
    try {
      const msg = await MessagesAPI.send(id, text);
      setMessages((prev) => [...prev, msg]);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to send message");
    }
  };

  const handleMarkCompleted = async () => {
    if (!id) return;
    if (!confirm("Mark this order as completed?")) return;

    setCompleting(true);
    try {
      const updated = await OrdersAPI.complete(id);
      setOrder(updated);
      alert("Order marked as completed.");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to complete order");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-xs text-slate-500">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl rounded-xl bg-white p-4 shadow-sm text-xs text-red-600">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl rounded-xl bg-white p-4 shadow-sm text-xs text-red-600">
        Order not found.
      </div>
    );
  }

  const isCompleted = order.status === "COMPLETED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Order details
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Download final files and chat with your expert.
          </p>
        </div>
        <div className="text-right text-xs">
          <div className="font-medium text-slate-900">
            {order.assignment?.title ?? "Untitled assignment"}
          </div>
          <div className="text-slate-500">
            Expert: {order.expert?.name ?? "N/A"}
          </div>
          <div className="text-slate-500">
            Price: ${order.agreedPrice}
          </div>
          <div className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
            Status: {order.status}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
        {/* Deliverables */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Final files
          </h2>
          {deliverables.length === 0 ? (
            <p className="text-xs text-slate-500">
              No deliverables uploaded yet.
            </p>
          ) : (
            <ul className="space-y-2 text-xs">
              {deliverables.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-2 rounded border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div>
                    <a
                      href={fileUrl(d.filePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {d.originalName}
                    </a>
                    <div className="text-[10px] text-slate-500">
                      Uploaded by: {d.uploader?.name ?? "Expert"} ·{" "}
                      {new Date(d.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right text-[10px]">
                    <div
                      className={
                        d.isVerified
                          ? "text-emerald-600 font-semibold"
                          : "text-slate-500"
                      }
                    >
                      {d.isVerified ? "Verified ✅" : "Pending review"}
                    </div>
                    <div className="text-slate-400">
                      {(d.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleMarkCompleted}
            disabled={isCompleted || completing}
            className="mt-3 rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isCompleted
              ? "Order already completed"
              : completing
              ? "Completing..."
              : "Mark as completed"}
          </button>
        </div>

        {/* Chat */}
        <div className="flex flex-col rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Chat with expert
          </h2>
          <div className="flex-1 overflow-y-auto rounded border border-slate-100 bg-slate-50 p-2 text-xs">
            {messages.length === 0 ? (
              <p className="text-slate-500">No messages yet.</p>
            ) : (
              <div className="space-y-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="rounded bg-white px-2 py-1 shadow-sm"
                  >
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
            )}
          </div>

          <div className="mt-2 flex gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message to your expert..."
              className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOrderDetailPage;
