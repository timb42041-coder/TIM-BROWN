import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "⚠️ No reply";

    return NextResponse.json({ response: reply });
  } catch (err) {
    return NextResponse.json(
      { response: "❌ Error: Failed to connect to OpenAI" },
      { status: 500 }
    );
  }
}
