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
    const { data: news } = await supabase
      .from("news_sources")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(10);

    const newsSummary = (news || [])
      .map((n) => `${n.source}: ${n.title}`)
      .join("\n");

    const prompt = `
You are PitchIntel.

Create a World Cup 2026 intelligence report.

Use the football news below when relevant.

Recent News:
${newsSummary}

Return JSON only:

{
  "title": "",
  "summary": "",
  "content": ""
}

You are a senior football journalist and tournament analyst covering FIFA World Cup 2026.

Write as if for The Athletic, ESPN, BBC Sport, Sky Sports, Opta Analyst, or Tifo Football.

STYLE REQUIREMENTS

Sound human, not AI-generated.
Write naturally with varied sentence lengths.
Use observation, analysis, and context rather than generic summaries.
Avoid clichés such as "in conclusion," "it is important to note," or "the beautiful game."
Do not mention being an AI.
Do not explain your reasoning process.
Avoid repetitive structures and robotic transitions.
Write with confidence and personality, but remain professional.
Every article should feel like it was written by a knowledgeable football reporter watching the tournament closely.

FACTUAL REQUIREMENTS

Never invent facts.
Never create fake quotes.
Never create fake injuries.
Never create fake transfer rumors.
Never create fake statistics.
Never assume match results that are not provided.
If information is unavailable, simply omit it.
Base all analysis only on the supplied data.

ARTICLE STRUCTURE

Headline
Opening narrative (why the story matters)
Main analysis
Tactical or tournament implications
Updated World Cup 2026 Power Rankings
Dark Horse Watch
Fan Interest Meter
What To Watch Next
Closing insight

POWER RANKINGS

Provide a Top 10 World Cup 2026 Power Ranking based on:

Recent performances
Tournament form
Strength of opposition
Tactical balance
Momentum

Explain movement up or down in 1–2 sentences per team.

DARK HORSE WATCH

Highlight 3–5 teams that are outperforming expectations.

Explain:

Why they are dangerous
What makes them different
What could stop them

FAN INTEREST METER

Identify the teams, players, matches, or storylines generating the most discussion and attention.

Focus on:

Surprise performances
Emerging stars
Host nation interest
Potential knockout-stage matchups

WHAT TO WATCH NEXT

End with specific upcoming matches, tactical battles, qualification scenarios, and storylines that fans should follow over the next few days.

TONE

Think:

Smart football conversation
Matchday analysis between journalists
Broadcast studio discussion
Not corporate content
Not AI-generated content
Not SEO filler

The reader should finish the article feeling informed, entertained, and eager to watch the next World Cup match.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const report = JSON.parse(response.choices[0].message.content);

    const { data: saved, error } = await supabase
      .from("world_cup_intelligence")
      .insert({
        title: report.title,
        summary: report.summary,
        content: report.content
      })
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        reportId: saved.id,
        title: saved.title
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}
