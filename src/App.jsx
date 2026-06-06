import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
const [matches, setMatches] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadMatches() {
try {
const { data, error } = await supabase
.from("matches")
.select("*")
.order("match_date", { ascending: true })
.limit(10);

    if (error) {
      console.error(error);
    } else {
      setMatches(data || []);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

loadMatches();

}, []);

return (


FootballIntel
AI-powered football intelligence



  <main>
    <section className="card">
      <h2>🔥 Story of the Day</h2>

      <h3>
        Liverpool's Momentum Is Starting To Feel Real
      </h3>

      <p>
        Five wins in six matches have transformed
        Liverpool from contender to genuine threat.
        Confidence is growing and rivals are beginning
        to feel the pressure.
      </p>
    </section>

    <section className="card">
      <h2>📈 Momentum Rankings</h2>

      <ol>
        <li>Liverpool</li>
        <li>Barcelona</li>
        <li>Arsenal</li>
        <li>Inter Milan</li>
        <li>Bayern Munich</li>
      </ol>
    </section>

    <section className="card">
      <h2>❤️ Fan Mood Tracker</h2>

      <ul>
        <li>Liverpool — Optimistic</li>
        <li>Arsenal — Nervous</li>
        <li>Barcelona — Confident</li>
        <li>Chelsea — Frustrated</li>
      </ul>
    </section>

    <section className="card">
      <h2>😂 Chaos Meter</h2>

      <ol>
        <li>Chelsea</li>
        <li>Tottenham</li>
        <li>Manchester United</li>
      </ol>

      <p>
        Every week feels like a different season.
      </p>
    </section>

    <section className="card">
      <h2>⚽ Today's Matches</h2>

      {loading ? (
        <p>Loading matches...</p>
      ) : matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <ul>
          {matches.map((match) => (
            <li key={match.id}>
              <strong>
                {match.home_team}
              </strong>
              {" vs "}
              <strong>
                {match.away_team}
              </strong>

              {match.match_date && (
                <>
                  {" "}
                  —
                  {" "}
                  {new Date(
                    match.match_date
                  ).toLocaleDateString()}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>

    <section className="card subscribe">
      <h2>
        📩 Subscribe to Daily Briefing
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
      />

      <button>
        Subscribe
      </button>
    </section>
  </main>
</div>

);
}
