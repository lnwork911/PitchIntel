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

const { data: matches, error: matchesError } =
  await supabase
    .from("matches")
    .select("*")
    .order("match_date", {
      ascending: false
    })
    .limit(10);

if (matchesError) {
  throw matchesError;
}

if (!matches || matches.length === 0) {
  throw new Error(
    "No matches found in database"
  );
}

const matchSummary = matches
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
* Professional football analyst
* No plagiarism
* No fake quotes
* No made-up injuries
* Explain why the results matter
* Explain fan emotions
* Explain future implications

Recent matches:

${matchSummary}

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
    temperature: 0.8
  });

const raw =
  response.choices[0].message.content;

const article = JSON.parse(raw);

const { data: savedArticle, error: insertError } =
  await supabase
    .from("ai_articles")
    .insert({
      title: article.title,
      summary: article.summary,
      content: article.content,
      article_type: "story_of_the_day"
    })
    .select()
    .single();

if (insertError) {
  throw insertError;
}

return {
  statusCode: 200,
  headers: {
    "Content-Type":
      "application/json"
  },
  body: JSON.stringify({
    success: true,
    articleId: savedArticle.id,
    title: savedArticle.title
  })
};

} catch (error) {

console.error(
  "generate-story error:",
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
    error: error.message
  })
};

}
}
