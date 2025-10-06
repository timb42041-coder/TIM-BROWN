'use client'

import React, { useState, useEffect, useRef } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessages((m) => [...m, { role: 'assistant', content: data.response }])
      } else setError(data.error || 'Unexpected error')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md h-[75vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <p className="text-gray-400 text-sm">Thinking…</p>}
          <div ref={chatEndRef} />
        </div>

        {error && <div className="bg-red-100 text-red-600 text-center text-sm py-2">{error}</div>}

        <form onSubmit={sendMessage} className="p-3 flex gap-2 border-t bg-gray-50">
          <input
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
      <footer className="mt-2 text-xs text-gray-400">Powered by OpenAI</footer>
    </main>
  )
}
