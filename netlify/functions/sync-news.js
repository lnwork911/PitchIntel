import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler() {
  try {

    const feeds = [
      {
        source: "BBC Sport",
        url:
          "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/sport/football/rss.xml"
      },
      {
        source: "Guardian",
        url:
          "https://api.rss2json.com/v1/api.json?rss_url=https://www.theguardian.com/football/rss"
      }
    ];

    function decodeHtml(text = "") {
      const entities = {
        "&amp;": "&",
        "&quot;": '"',
        "&#39;": "'",
        "&lt;": "<",
        "&gt;": ">"
      };
    
      return Object.entries(entities)
        .reduce(
          (str, [entity, char]) =>
            str.replaceAll(entity, char),
          text
        );
    }  

    let inserted = 0;

    for (const feed of feeds) {

      const response =
        await fetch(feed.url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${feed.source}`
        );
      }

      const rss =
        await response.json();

      if (!rss.items) {
        continue;
      }

      const articles =
        rss.items
          .slice(0, 10)
          .map(item => ({
            source: feed.source,

            title:
              decodeHtml(item.title) || "",

            url:
              item.link || "",

            summary:
              decodeHtml(item.description) ||
              decodeHtml(item.content) ||
              "",

            published_at:
              item.pubDate || null
          }));

      for (const article of articles) {

        const { error } =
          await supabase
            .from("news_sources")
            .upsert(
              article,
              {
                onConflict: "title"
              }
            );

        if (error) {
          console.error(error);
        } else {
          inserted++;
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        success: true,
        articlesInserted:
          inserted
      })
    };

  } catch (error) {

    console.error(
      "sync-news error:",
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
