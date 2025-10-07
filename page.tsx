"use client";

import { useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      alert("Failed to fetch reply. Check API key or network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg w-full bg-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
      <h1 className="text-xl font-semibold text-center mb-4">AI Chat Assistant</h1>
      <div className="h-80 overflow-y-auto bg-slate-900 p-3 rounded-lg">
        {messages.map((m, i) => (
          <p key={i} className={`${m.role === "user" ? "text-right text-blue-400" : "text-left text-green-400"}`}>
            {m.content}
          </p>
        ))}
        {loading && <p className="text-gray-400 italic">Thinking...</p>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg bg-slate-700 focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
          Send
        </button>
      </form>
    </main>
  );
}
