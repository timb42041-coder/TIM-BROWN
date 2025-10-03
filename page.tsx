'use client'

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-black text-white px-2">
      <div className="w-full max-w-md flex flex-col flex-1 py-6">
        <h1 className="text-2xl font-bold mb-4 text-center">AI Assistant Chat</h1>
        <div className="flex-1 overflow-y-auto mb-4 rounded-lg bg-gray-900 border border-gray-800 p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] break-words ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="flex gap-2" onSubmit={sendMessage}>
          <input
            className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:border-blue-600"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            type="submit"
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
      <footer className="mt-auto py-4 text-xs text-gray-400 text-center">
        Powered by Next.js 14 + OpenAI
      </footer>
    </main>
  );
}
