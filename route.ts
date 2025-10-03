import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message?.content ?? "No response";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "Error: API call failed" });
  }
}
