import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler() {
  try {
    const response = await fetch(
      "https://api.football-data.org/v4/matches",
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `Football API returned ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.matches) {
      throw new Error("No matches returned");
    }

    const matches = result.matches.map((match) => ({
      api_match_id: match.id,
      home_team: match.homeTeam?.name || "",
      away_team: match.awayTeam?.name || "",
      status: match.status || "",
      match_date: match.utcDate || null,
      competition: match.competition?.name || ""
    }));

    const { error } = await supabase
      .from("matches")
      .upsert(matches, {
        onConflict: "api_match_id"
      });

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        matchesSynced: matches.length
      })
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}
