import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: 'OpenAI API key not found.' }, { status: 500 });
  }

  const messagesForAPI = messages.map((m: any) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messagesForAPI,
        max_tokens: 200,
      }),
    });

    if (!openaiRes.ok) {
      throw new Error('OpenAI API error');
    }

    const openaiData = await openaiRes.json();
    const reply = openaiData.choices?.[0]?.message?.content?.trim() || 'No response';

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ reply: 'Error communicating with OpenAI.' }, { status: 500 });
  }
}
