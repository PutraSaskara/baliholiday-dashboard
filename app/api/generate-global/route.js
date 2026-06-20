import { NextResponse } from 'next/server';

export const maxDuration = 180; // Set maximum execution time to 180 seconds (3 minutes)
export async function POST(req) {
  try {
    const { model, mode, tourId, blogId, targetSection, drafts, currentSectionData } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API Key is missing in environment variables.' },
        { status: 500 }
      );
    }

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

    console.log("SENDING TO OPENROUTER: ", { targetSection, tourId, blogId, fullContextKeys: Object.keys(fullContext) });
    if (fullContext.Detail) console.log("Detail exists");
    if (fullContext.Plan) console.log("Plan exists");
    if (fullContext.Description) console.log("Description exists");

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
    console.error('API /generate-global error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
