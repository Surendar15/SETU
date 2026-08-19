import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { sendChatMessage, getChatHistory } from "../api/chatApi";

export default function ChatPanel({ deliveryId, onClose }) {
  const { user } = useAuth();
  const { stompClient } = useNotifications() || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    getChatHistory(deliveryId)
      .then((res) => setMessages(res.data))
      .catch(() => setError("Failed to load chat history."))
      .finally(() => setLoading(false));
  }, [deliveryId]);

  useEffect(() => {
    if (!stompClient) return;

    const subscription = stompClient.subscribe(`/topic/chat/${deliveryId}`, (message) => {
      const body = JSON.parse(message.body);
      setMessages((prev) => [...prev, body]);
    });

    return () => subscription.unsubscribe();
  }, [stompClient, deliveryId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    try {
      await sendChatMessage(deliveryId, input.trim());
      setInput("");
      // The message will also arrive via the WebSocket subscription above -
      // we don't need to manually append it here.
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message.");
    }
  };

  return (
    <div
      style={{
        marginTop: 14,
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-sunken)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <span className="meta" style={{ fontWeight: 600 }}>Delivery chat</span>
        <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
      </div>

      <div style={{ maxHeight: 260, overflowY: "auto", padding: 14 }}>
        {loading ? (
          <p className="meta">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="meta">No messages yet — say hello.</p>
        ) : (
          messages.map((m) => {
            const isMine = m.senderId === user.userId;
            return (
              <div key={m.id} style={{ marginBottom: 10, textAlign: isMine ? "right" : "left" }}>
                <div
                  style={{
                    display: "inline-block",
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: isMine ? "var(--pine)" : "var(--surface)",
                    color: isMine ? "#fff" : "var(--ink)",
                    border: isMine ? "none" : "1px solid var(--line)",
                    fontSize: 14,
                  }}
                >
                  {m.content}
                </div>
                <div className="meta" style={{ fontSize: 11, marginTop: 2 }}>
                  {m.senderName} · {m.senderRole} · {formatTime(m.sentAt)}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && <div className="banner-error" style={{ margin: "0 14px" }}>{error}</div>}

      <form onSubmit={handleSend} style={{ display: "flex", gap: 8, padding: 14, borderTop: "1px solid var(--line)" }}>
        <input
          className="input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm">Send</button>
      </form>
    </div>
  );
}