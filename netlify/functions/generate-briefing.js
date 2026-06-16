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

    // Recent matches

    const { data: matches } =
      await supabase
        .from("matches")
        .select("*")
        .order(
          "match_date",
          { ascending: false }
        )
        .limit(10);

    // Recent news

    const { data: news } =
      await supabase
        .from("news_sources")
        .select("*")
        .order(
          "published_at",
          { ascending: false }
        )
        .limit(10);

    const matchSummary =
      (matches || [])
        .map(
          m =>
            `${m.home_team} ${m.home_score ?? "-"}-${m.away_score ?? "-"} ${m.away_team}`
        )
        .join("\n");

    const newsSummary =
      (news || [])
        .map(
          n =>
            `${n.source}: ${n.title}`
        )
        .join("\n");

    const prompt = `
You are PitchIntel.

Using the football results and football news below, create a professional football intelligence briefing.

Requirements:

- Human sounding
- Professional analyst
- No fake quotes
- No made-up injuries
- No made-up facts
- Explain why developments matter
- Mention fan impact
- Mention future implications
- Mention possible World Cup implications when relevant

Recent Matches:

${matchSummary}

Recent News:

${newsSummary}

Return JSON only:

{
  "title": "",
  "summary": "",
  "content": ""
}
`;

    const response =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      });

const raw =
  response.choices[0]
    .message.content || "";

    const cleaned =
      raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    
    //const briefing =
    //  JSON.parse(cleaned);

    try {
      briefing = JSON.parse(cleaned);
    } catch (e) {
      console.error("AI JSON parse error");
      console.error(cleaned);
    
      throw new Error(
        "OpenAI returned invalid JSON"
      );
    }    
    
    const {
      data: saved,
      error
    } =
      await supabase
        .from("daily_briefings")
        .insert({
          title:
            briefing.title,

          summary:
            briefing.summary,

          content:
            briefing.content
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        success: true,
        briefingId:
          saved.id
      })
    };

  } catch (error) {

    console.error(
      "generate-briefing error:",
      error
    );

    return {
      statusCode: 500,
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        success: false,
        error:
          error.message
      })
    };
  }
}
