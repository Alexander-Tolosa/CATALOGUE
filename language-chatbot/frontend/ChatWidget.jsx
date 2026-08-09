import { useState, useRef, useEffect } from "react";

// Drop this into your chatbot page. Adjust API_URL to point at your deployed backend.
const API_URL = "/api/chat";

export default function ChatWidget({ targetLanguage = "ja", userLevel = "beginner" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, userLevel, targetLanguage }),
      });
      const data = await res.json();
      setMessages([...nextMessages, { role: "assistant", content: data.reply ?? data.error }]);
    } catch (err) {
      setMessages([...nextMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", maxWidth: 640 }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 12,
                background: m.role === "user" ? "#DCE7FB" : "#F1EFE8",
                maxWidth: "80%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div style={{ color: "#888780" }}>Thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 8, padding: 16, borderTop: "1px solid #D3D1C7" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about grammar, vocab, or practice a sentence..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #D3D1C7" }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: "10px 16px", borderRadius: 8 }}>
          Send
        </button>
      </div>
    </div>
  );
}
