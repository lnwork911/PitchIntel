import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler() {
  try {
    const { data: matches, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .order("match_date", { ascending: true })
      .limit(10);

    if (matchError) throw matchError;

    const { data: stories, error: storyError } = await supabase
      .from("ai_articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (storyError) throw storyError;

    const matchText = matches
      ?.map(
        (m) =>
          `${m.home_team} vs ${m.away_team} — ${m.status || "scheduled"}`
      )
      .join("\n");

    const storyText = stories
      ?.map((s) => `${s.title}: ${s.summary}`)
      .join("\n");

    const prompt = `
You are PitchIntel.

Create a daily football briefing.

Style:
- ESPN energy
- The Athletic intelligence
- Tifo explanation
- Bloomberg-style concise insight
- Human, emotional, original
- No fake quotes
- No plagiarism

Recent stories:
${storyText}

Upcoming/recent matches:
${matchText}

Return JSON only:

{
  "title": "",
  "summary": "",
  "content": ""
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_object"
      }
    });

    const briefing = JSON.parse(
      completion.choices[0].message.content
    );

    const { data: saved, error: insertError } = await supabase
      .from("daily_briefings")
      .insert({
        title: briefing.title,
        summary: briefing.summary,
        content: briefing.content
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        briefingId: saved.id,
        title: saved.title
      })
    };
  } catch (error) {
    console.error("generate-briefing error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}
