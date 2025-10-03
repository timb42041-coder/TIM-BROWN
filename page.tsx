"use client";
import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you today?" }
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
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "No reply." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: Could not connect to AI." }
      ]);
    }

    setLoading(false);
  }

  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex flex-col items-center justify-center mt-12 mb-6">
        <span className="text-6xl">⚡</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2">
          TIMBROWN AI
        </h1>
        <p className="text-lg text-gray-400 text-center">Your personal AI assistant.</p>
      </header>

      {/* Chat section */}
      <section className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-xl flex flex-col-reverse gap-2 overflow-y-auto px-2 mb-4"
             style={{ minHeight: 180, maxHeight: 320 }}>
          <div ref={chatEndRef} />
          {messages.slice().reverse().map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] break-words shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-white border border-gray-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Input form */}
      <form
        onSubmit={sendMessage}
        className="w-full max-w-xl mx-auto px-4 pb-6 fixed left-1/2 -translate-x-1/2 bottom-0"
      >
        <div className="flex items-center gap-2 bg-gray-900 rounded-2xl border border-gray-800 p-2">
          <input
            type="text"
            className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </form>
    </main>
  );
}
