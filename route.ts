// TIM-BROWN AI Backend
// Secure, production-ready OpenAI API handler

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are TIM-BROWN AI, a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content || "No reply.";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to OpenAI" },
      { status: 500 }
    );
  }
}
