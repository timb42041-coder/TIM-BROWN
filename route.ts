import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format.' }, { status: 400 })
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    })

    const response = chatCompletion.choices?.[0]?.message?.content ?? ""
    return NextResponse.json({ response })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to connect to OpenAI." }, { status: 500 })
  }
}
