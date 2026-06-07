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

const { data: matches, error } =
  await supabase
    .from("matches")
    .select("*")
    .order("match_date", {
      ascending: false
    })
    .limit(10);

if (error) throw error;

if (!matches?.length) {
  throw new Error(
    "No matches found"
  );
}

const matchSummary =
  matches
    .map(
      (m) =>
        `${m.home_team} ${m.home_score ?? "-"}-${m.away_score ?? "-"} ${m.away_team}`
    )
    .join("\n");

const prompt = `

You are FootballIntel.

Write an original football article.

Requirements:

* Human sounding
* The Athletic style
* Explain why it matters
* Explain fan emotions
* Explain future implications
* No fake quotes
* No fake injuries

Recent Matches:

${matchSummary}

Return JSON:

{
"title":"",
"summary":"",
"content":""
}
`;

const completion =
  await openai.chat.completions.create({
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

const article =
  JSON.parse(
    completion.choices[0]
      .message.content
  );

const {
  data: insertedArticle,
  error: insertError
} =
  await supabase
    .from("ai_articles")
    .insert({
      title: article.title,
      summary: article.summary,
      content: article.content,
      article_type:
        "story_of_the_day"
    })
    .select()
    .single();

if (insertError)
  throw insertError;

return {
  statusCode: 200,
  body: JSON.stringify({
    success: true,
    articleId:
      insertedArticle.id,
    title:
      insertedArticle.title
  })
};

} catch (err) {

console.error(err);

return {
  statusCode: 500,
  body: JSON.stringify({
    success: false,
    error: err.message
  })
};


}
}

