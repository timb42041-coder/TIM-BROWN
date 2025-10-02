'use client';
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });
    const data = await res.json();
    setMessages([...messages, userMessage, { role: "assistant", content: data.reply }]);
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-lg space-y-3 h-[70vh] overflow-y-auto border p-3 rounded">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4 w-full max-w-lg">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}