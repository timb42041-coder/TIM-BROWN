'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: failed to fetch reply.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full max-w-2xl mx-auto p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-4 text-center">AI Problem Solver</h1>
      <div className="flex-1 overflow-y-auto space-y-4 bg-gray-800 p-4 rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 rounded-l bg-gray-700 border border-gray-600"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 rounded-r disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </main>
  );
}
