import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { formData, model } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API Key is missing in environment variables.' },
        { status: 500 }
      );
    }

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

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_BACKEND_URL || 'https://baliholiday.xyz',
        'X-Title': 'BaliHoliday Dashboard'
      },
      body: JSON.stringify({
        model: model || 'google/gemini-flash-1.5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" } // Tell the model to return JSON if supported
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        return NextResponse.json({ error: 'Failed to generate content from OpenRouter', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Clean up potential markdown wrapper just in case
    content = content.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

    const parsedJson = JSON.parse(content);

    return NextResponse.json(parsedJson);

  } catch (error) {
    console.error('API /generate error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
