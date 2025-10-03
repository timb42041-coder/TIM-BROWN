"use client";
import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hi! I’m your AI assistant. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.response || "⚠️ No reply" },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "❌ Error: Could not connect to AI." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold text-center py-6">🤖 AI Assistant</h1>
      <div className="flex-1 overflow-y-auto px-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 p-3 rounded-lg max-w-[75%] ${
              msg.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex p-4 bg-gray-900">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          disabled={loading}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </main>
  );
}
