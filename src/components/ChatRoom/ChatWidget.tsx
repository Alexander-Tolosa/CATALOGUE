import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";

interface ChatWidgetProps {
  targetLanguage?: string;
  userLevel?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  targetLanguage = "ja",
  userLevel = "beginner"
}) => {
  const { isDarkMode } = useAppStore();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user" as const, content: input };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, userLevel, targetLanguage }),
      });
      const data = await res.json();
      setMessages([...nextMessages, { role: "assistant", content: data.reply ?? data.error ?? "No response" }]);
    } catch (err) {
      setMessages([...nextMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex flex-col h-full max-w-2xl mx-auto rounded-3xl border shadow-sm ${
      isDarkMode ? 'bg-[#131b2e] border-slate-800 text-white' : 'bg-white border-[#EDE5DA] text-[#2B2725]'
    }`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#F06543]">smart_toy</span>
          <h3 className="font-display font-bold text-sm">Grounded AI Language Tutor</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFF4EE] text-[#F06543] border border-[#FDE3D5]">
          {targetLanguage.toUpperCase()} • {userLevel}
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[320px] max-h-[460px] no-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#F06543]/60">menu_book</span>
            <p className="text-xs font-semibold">Ask any grammar or vocabulary question grounded in real language database rules!</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`inline-block px-4 py-2.5 rounded-2xl text-xs md:text-sm max-w-[80%] leading-relaxed ${
                m.role === "user"
                  ? "bg-[#F06543] text-white font-semibold rounded-br-none"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                  : "bg-[#FAF6F0] text-[#2B2725] border border-[#EDE5DA] rounded-bl-none"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pl-2">
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            <span>Fetching verified language facts...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about grammar, vocab, or practice a sentence..."
          className={`flex-1 px-4 py-2.5 text-xs md:text-sm rounded-xl border focus:outline-none transition-colors ${
            isDarkMode
              ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#F06543]'
              : 'bg-[#FAF6F0] border-[#EDE5DA] text-[#2B2725] placeholder-[#7A736E] focus:border-[#F06543]'
          }`}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-[#F06543] hover:bg-[#E05432] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
        >
          <span>Send</span>
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </div>
    </div>
  );
};
