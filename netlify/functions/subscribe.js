import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({
          success: false,
          error: "Method not allowed"
        })
      };
    }

    const { email } = JSON.parse(event.body);

    if (!email || !email.includes("@")) {
      throw new Error("Valid email is required");
    }

    const { error } = await supabase
      .from("subscribers")
      .upsert(
        { email },
        { onConflict: "email" }
      );

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Subscribed successfully"
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
