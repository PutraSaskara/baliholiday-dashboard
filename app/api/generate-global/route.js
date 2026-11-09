import { NextResponse } from 'next/server';
import { guardAiRequest } from '../../../lib/aiGuard';

export const maxDuration = 60;
// Vercel Hobby membatasi maxDuration 60 detik. Naikkan hanya bila plan mendukung.
export async function POST(req) {
  try {
    // Auth (valid JWT cookie) + validasi provider/model + 100 KB body cap + rate limit.
    const guard = await guardAiRequest(req);
    if (!guard.ok) {
      return guard.response;
    }

    const { mode, tourId, blogId, targetSection, drafts, currentSectionData, maxTokens } = guard.body;
    const { provider, model } = guard; // provider enum + model non-empty sudah divalidasi guard
    // maxTokens opsional: diteruskan ke proxy bila client minta generate pendek.
    const maxTokensInt =
      Number.isInteger(maxTokens) && maxTokens >= 1 && maxTokens <= 100000
        ? maxTokens
        : undefined;

    let fullContext = {};
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

    if (mode === 'add') {
      // In Add mode, the full context is simply the drafts provided by the frontend
      fullContext = drafts;
    } else if (mode === 'edit') {
      // In Edit mode, we fetch the existing context from the backend
      if (tourId) {
        const tourRes = await fetch(`${backendUrl}/tours/${tourId}`, {
           headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' }
        });
        if (!tourRes.ok) {
           console.warn(`Could not fetch full tour context for ID ${tourId}.`);
        } else {
           const data = await tourRes.json();
           fullContext = data.tour || data;
        }
      } else if (blogId) {
        const blogRes = await fetch(`${backendUrl}/single-blog/${blogId}`, {
           headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' }
        });
        if (!blogRes.ok) {
           console.warn(`Could not fetch full blog context for ID ${blogId}.`);
        } else {
           const data = await blogRes.json();
           fullContext = data;
        }
      } else {
         return NextResponse.json({ error: 'Tour ID or Blog ID is required for edit mode.' }, { status: 400 });
      }

      // Merge the current unsaved section data so the AI knows what the user just typed
      if (currentSectionData && targetSection) {
          fullContext[`current_editing_${targetSection}`] = currentSectionData;
      }
    }

    // Determine what we need to generate based on the mode and targetSection
    let systemPromptInstructions = "";
    let expectedOutputKeys = "";

    if (targetSection === 'tour') {
      systemPromptInstructions += `
      Generate missing data for the MAIN TOUR PACKAGE (Keywords, TL;DR, Guide Insights, FAQs).
      - "keywords": comma-separated string of highly searched SEO keywords based on the title and descriptions.
      - "tldr_summary": 2-3 sentences max, exciting and concise summary of the whole tour.
      - "guide_insight_location": 2-4 words (STRICT MAXIMUM 200 characters), e.g., "Ubud Culture Expert", "Mount Batur Native".
      - "guide_insight_content": 2-3 sentences of authentic insider tips from a local guide's perspective.
      - "faq": A JSON ARRAY of 3-5 objects with "question" and "answer" properties. Ensure the FAQs cover details mentioned in the itinerary or descriptions if any.
      `;
      expectedOutputKeys = `"keywords", "tldr_summary", "guide_insight_location", "guide_insight_content", "faq"`;
    }

    if (targetSection === 'detail') {
      systemPromptInstructions += `
      Generate missing data for TOUR DETAILS (Highlights, Short Descriptions).
      - "detail1" through "detail9": 1 short punchy sentence each highlighting a specific unique feature of the tour (e.g. "Witness the majestic Mount Batur sunrise"). STRICT MAXIMUM 200 CHARACTERS per detail. Do not exceed this limit. Only provide keys for the ones that are empty or missing in the provided data.
      `;
      expectedOutputKeys += (expectedOutputKeys ? ", " : "") + `"detail1" through "detail9" (only missing ones)`;
    }

    if (targetSection === 'desc') {
       systemPromptInstructions += `
       Generate missing data for TOUR DESCRIPTION (Long form paragraphs).
       - "desc1" through "desc3": 1 beautiful, evocative paragraph each (3-4 sentences per paragraph) describing the overall tour experience. Together, these 3 paragraphs should tell a cohesive, engaging story of the tour. Only provide keys for the ones that are empty or missing.
       `;
       expectedOutputKeys += (expectedOutputKeys ? ", " : "") + `"desc1" through "desc3" (only missing ones)`;
    }

    if (targetSection === 'plan') {
       systemPromptInstructions += `
       Generate missing data for TOUR PLAN (Itinerary descriptions).
       - "description1" through "description9": A lively and informative 1-2 paragraph description of the activity or location for that stop. Only provide keys for the ones that are empty or missing.
       `;
       expectedOutputKeys += (expectedOutputKeys ? ", " : "") + `"description1" through "description9" (only missing ones)`;
    }

    if (targetSection === 'article') {
      systemPromptInstructions += `
      Generate missing data for the ARTICLE/BLOG POST (Keywords, TL;DR, Guide Insights, FAQs).
      - "keywords": comma-separated string of highly searched SEO keywords based on the title.
      - "tldr_summary": 2-3 sentences max, exciting and concise summary of the article.
      - "guide_insight_location": 2-4 words (STRICT MAXIMUM 200 characters), e.g., "Ubud Culture Expert", "Mount Batur Native".
      - "guide_insight_content": 2-3 sentences of authentic insider tips from a local guide's perspective.
      - "faq": A JSON ARRAY of 3-5 objects with "question" and "answer" properties based on the article topic.
      `;
      expectedOutputKeys = `"keywords", "tldr_summary", "guide_insight_location", "guide_insight_content", "faq"`;
    }

    if (targetSection === 'article-paragraphs') {
       systemPromptInstructions += `
       Generate missing data for the ARTICLE/BLOG PARAGRAPHS.
       - "paragraf1": A strong introduction paragraph.
       - "titleparagraf2" through "titleparagraf7": Short subtitles for the sections. STRICT MAXIMUM 200 CHARACTERS.
       - "paragraf2" through "paragraf7": The content of the article broken down into detailed paragraphs.
       - "Conclusion": A summarizing concluding paragraph.
       Only provide keys for the ones that are empty or missing in the provided data. Do not generate keys that are already filled.
       `;
       expectedOutputKeys = `"paragraf1", "titleparagraf2" through "titleparagraf7", "paragraf2" through "paragraf7", "Conclusion" (only missing ones)`;
    }

    const systemPrompt = `You are a professional travel copywriter and SEO expert specialized in Bali tours and travel blogs.
You act as a "Global Editor". You must read the ENTIRE context provided to ensure your generated content is 100% accurate, cohesive, and highly engaging.

Your specific tasks right now:
${systemPromptInstructions}

Rules for output:
- Return ONLY valid JSON.
- DO NOT wrap the JSON in Markdown backticks (e.g., \`\`\`json). Just return the raw JSON object.
- Only generate fields that are empty or missing. If a field is already provided and looks complete, do NOT overwrite it in your JSON.
- The root keys of your JSON MUST EXACTLY MATCH the expected field names (${expectedOutputKeys}).
- Make the content highly engaging and SEO-driven.`;

    const userPrompt = `Here is the FULL context:
${JSON.stringify(fullContext, null, 2)}

Please generate the required missing fields in JSON format.`;

    // Semua pemanggilan provider lewat backend (/api/ai/proxy) — dashboard
    // tidak lagi memegang API key provider.
    const proxyRes = await fetch(`${backendUrl}/api/ai/proxy`, {
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
        responseFormat: { type: 'json_object' },
        ...(maxTokensInt ? { maxTokens: maxTokensInt } : {}),
      }),
    });

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
    console.error('API /generate-global error:', error);
    return NextResponse.json(
      { error: 'AI request failed', code: 'AI_INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
