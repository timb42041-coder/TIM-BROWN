import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY)
    return NextResponse.json({ reply: "Error: Missing OpenAI API key." }, { status: 500 });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: "API call failed." }, { status: 500 });
  }
}
