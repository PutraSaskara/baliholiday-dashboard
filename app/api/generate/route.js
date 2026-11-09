import { NextResponse } from 'next/server';
import { guardAiRequest } from '../../../lib/aiGuard';

// Bentuk respons yang diminta backend /api/ai/proxy (object JSON).
const JSON_RESPONSE_FORMAT = { type: 'json_object' };

export const maxDuration = 60;
// Vercel Hobby membatasi maxDuration 60 detik. Naikkan hanya bila plan mendukung.

export async function POST(req) {
  try {
    // Auth (valid JWT cookie) + validasi provider/model + 100 KB body cap + rate limit.
    const guard = await guardAiRequest(req);
    if (!guard.ok) {
      return guard.response;
    }

    const { formData, maxTokens } = guard.body;
    const { provider, model } = guard;
    // maxTokens opsional: diteruskan ke proxy bila client minta generate pendek.
    const maxTokensInt =
      Number.isInteger(maxTokens) && maxTokens >= 1 && maxTokens <= 100000
        ? maxTokens
        : undefined;

    const title = formData.title || 'Bali Tour';
    
    // Construct the prompt carefully
    const systemPrompt = `You are a professional travel copywriter and SEO expert specialized in Bali, Indonesia tours.
The user is filling out a tour package form. You need to generate content for the EMPTY or VERY SHORT fields.
Please read the provided data context and generate highly engaging, SEO-optimized content for the missing parts.

Rules for output:
- Return ONLY valid JSON.
- DO NOT wrap the JSON in Markdown backticks (e.g., \`\`\`json). Just return the raw JSON object.
- The JSON must have these exact keys: "keywords", "tldr_summary", "guide_insight_location", "guide_insight_content", "faq"
- For "keywords": comma-separated string of highly searched SEO keywords.
- For "tldr_summary": 2-3 sentences max, exciting and concise summary.
- For "guide_insight_location": 2-4 words, e.g., "Ubud Culture Expert", "Mount Batur Native".
- For "guide_insight_content": 2-3 sentences of authentic insider tips from a local guide's perspective.
- For "faq": A JSON ARRAY of 3-5 objects with "question" and "answer" properties.

If the user's data already has some of these fields adequately filled, you can still refine or provide better ones, but ensure the structure is exactly as requested.`;

    const userPrompt = `Here is the current tour data:
${JSON.stringify(formData, null, 2)}

Please generate the JSON for the missing or weak fields focusing on the topic: "${title}".`;

    // Semua pemanggilan provider lewat backend (/api/ai/proxy) — dashboard
    // tidak lagi memegang API key provider.
    const proxyRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/ai/proxy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({
          provider,
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          responseFormat: JSON_RESPONSE_FORMAT,
          ...(maxTokensInt ? { maxTokens: maxTokensInt } : {}),
        }),
      }
    );

    if (!proxyRes.ok) {
        // Log upstream detail server-side only; never forward it to the client.
        const errorText = await proxyRes.text();
        console.error("AI proxy error:", proxyRes.status, errorText);
        return NextResponse.json(
            { error: 'AI request failed', code: 'AI_UPSTREAM_ERROR' },
            { status: 502 }
        );
    }

    const data = await proxyRes.json();
    if (!data || typeof data.content !== 'string') {
      throw new Error('AI proxy returned unexpected payload.');
    }
    let content = data.content;

    // Clean up potential markdown wrapper just in case
    content = content.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

    const parsedJson = JSON.parse(content);

    return NextResponse.json(parsedJson);

  } catch (error) {
    // error.message can embed upstream body snippets (JSON parse failures).
    console.error('API /generate error:', error);
    return NextResponse.json(
      { error: 'AI request failed', code: 'AI_INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
