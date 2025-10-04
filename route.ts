import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    return NextResponse.json({
      reply: completion.choices[0].message?.content || 'No reply',
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to connect to OpenAI' }, { status: 500 });
  }
}
