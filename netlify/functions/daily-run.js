export async function handler() {
  try {

    const base =
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL;

    const functions = [
      "sync-matches",
      "sync-news",
      "generate-story",
      "generate-briefing",
      "generate-world-cup"
    ];

    const results = [];

    for (const fn of functions) {

      const response =
        await fetch(
          `${base}/.netlify/functions/${fn}`
        );

      const data =
        await response.json();

      results.push({
        function: fn,
        result: data
      });
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        success: true,
        results
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error:
          error.message
      })
    };
  }
}
