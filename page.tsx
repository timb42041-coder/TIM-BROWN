'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function Page() {
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

    const userMessage: Message = { role: 'user', content: input }
    setMessages((msgs) => [...msgs, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessages((msgs) => [...msgs, { role: 'assistant', content: data.response }])
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch {
      setError('Failed to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md h-[75vh] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center my-8">Start chatting…</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-2">
              <div className="px-4 py-2 rounded-lg bg-gray-200 animate-pulse text-gray-400 text-sm">
                Thinking…
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {error && (
          <div className="px-4 py-2 bg-red-100 text-red-700 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={sendMessage} className="p-4 flex gap-2 bg-gray-50 border-t">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
      <footer className="mt-4 text-xs text-gray-400">
        Powered by OpenAI & Next.js
      </footer>
    </main>
  )
}
