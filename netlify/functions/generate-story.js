import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler() {
  try {
    // Verify Supabase connection
    const { count, error } = await supabase
      .from("matches")
      .select("*", {
        count: "exact",
        head: true
      });

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        message: "generate-story function works",
        matchesCount: count ?? 0
      })
    };
  } catch (error) {
    console.error("generate-story error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}
