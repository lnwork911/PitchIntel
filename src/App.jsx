import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [story, setStory] = useState(null);
  const [storyLoading, setStoryLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .order("match_date", { ascending: true })
          .limit(10);

        if (error) {
          console.error("Supabase error:", error);
        } else {
          setMatches(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  useEffect(() => {
    async function loadStory() {
      const { data, error } = await supabase
        .from("ai_articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
  
      if (error) {
        console.error(error);
      } else {
        setStory(data);
      }
  
      setStoryLoading(false);
    }
  
    loadStory();
  }, []);  
  
  return (
    <div className="app">
      <header className="hero">
        <h1>FootballIntel</h1>
        <p>AI-powered football intelligence</p>
      </header>

      <main>
        <section className="card">
          <h2>🔥 Story of the Day</h2>
        
          {storyLoading ? (
            <p>Loading story...</p>
          ) : !story ? (
            <p>No story found.</p>
          ) : (
            <>
              <h3 className="story-title">
                {story?.title}
              </h3>
              
              <p className="story-summary">
                {story?.summary}
              </p>
              
              <div className="story-content">
                {story?.content}
              </div>              
            </>
          )}
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
                  <strong>{match.home_team}</strong>
                  {" vs "}
                  <strong>{match.away_team}</strong>

                  {match.match_date && (
                    <>
                      {" — "}
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
          <h2>📩 Subscribe to Daily Briefing</h2>

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
