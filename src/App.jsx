import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [briefing, setBriefing] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: storyData } = await supabase
        .from("ai_articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      const { data: matchData } = await supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: true })
        .limit(10);

      /*
      const { data: briefingData } = await supabase
      .from("daily_briefings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
      */

      setStory(storyData?.[0] || null);
      setMatches(matchData || []);
      //setBriefing(briefingData?.[0] || null);
      setLoading(false);
    }

    /*
    async function handleSubscribe() {
      setSubscribeMessage("Saving...");
    
      const response = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        body: JSON.stringify({ email })
      });
    
      const result = await response.json();
    
      if (result.success) {
        setSubscribeMessage("Subscribed successfully.");
        setEmail("");
      } else {
        setSubscribeMessage(result.error || "Subscription failed.");
      }
    }
    */
    
    loadData();
  }, []);

  const momentum = [
    ["Liverpool", "88", "up"],
    ["Arsenal", "84", "up"],
    ["Manchester City", "81", "down"],
    ["Barcelona", "79", "up"]
  ];

  const moods = [
    ["Liverpool", "Optimistic", "green"],
    ["Arsenal", "Nervous", "yellow"],
    ["Chelsea", "Frustrated", "red"],
    ["Barcelona", "Confident", "green"]
  ];

  const chaos = [
    ["Chelsea", 92],
    ["Tottenham", 87],
    ["Manchester United", 83]
  ];

  return (
    <div className="app">
      <div className="ticker">
        <span>BREAKING</span>
        <p>Villa stun City • Arsenal stay alive • Chelsea pressure grows • Title race tightens</p>
      </div>

      <nav className="navbar">
        <div className="brand">
          <div className="brand-mark">PI</div>
          <div>
            <h1>PitchIntel</h1>
            <p>AI-powered football intelligence</p>
          </div>
        </div>
        <button className="nav-button">Daily Briefing</button>
      </nav>

      <section className="hero-story">
        <div>
          <p className="eyebrow">🔥 Story of the Day</p>
          <h2>
            {story?.title || "Football intelligence built for the modern fan"}
          </h2>
          <p className="hero-summary">
            {story?.summary ||
              "Real match data, AI analysis, fan emotion, momentum signals, and storylines that explain what football feels like today."}
          </p>
          <button className="primary-button">Read Analysis</button>
        </div>

        <div className="hero-panel">
          <p>Title Race Index</p>
          {momentum.slice(0, 3).map((team) => (
            <div className="metric-row" key={team[0]}>
              <span>{team[0]}</span>
              <strong>{team[1]}</strong>
            </div>
          ))}
        </div>
      </section>

      <main className="layout">
        <section className="left-column">
          <div className="card">
            <h3>🧠 Full Intelligence Brief</h3>
            <div className="article-body">
              {story?.content || "Generate a story to populate this section from ai_articles."}
            </div>
          </div>

          <div className="card">
            <h3>⚽ Match Intelligence</h3>

            {loading ? (
              <p>Loading matches...</p>
            ) : matches.length === 0 ? (
              <p>No matches found.</p>
            ) : (
              <div className="match-grid">
                {matches.map((match) => (
                  <div className="match-card" key={match.id}>
                    <div className="teams">
                      <span className="badge">{getInitials(match.home_team)}</span>
                      <strong>{match.home_team}</strong>
                      <span>vs</span>
                      <strong>{match.away_team}</strong>
                      <span className="badge">{getInitials(match.away_team)}</span>
                    </div>

                    <p>
                      {match.match_date
                        ? new Date(match.match_date).toLocaleDateString()
                        : "Date TBD"}
                    </p>

                    <div className="match-metrics">
                      <span>Importance 86</span>
                      <span>Upset Risk 28%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="right-column">
          <div className="card">
            <h3>📈 Momentum Rankings</h3>
            {momentum.map((team, index) => (
              <div className="rank-row" key={team[0]}>
                <span>{index + 1}. {team[0]}</span>
                <strong>{team[1]}</strong>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>❤️ Fan Mood Tracker</h3>
            {moods.map((item) => (
              <div className="mood-row" key={item[0]}>
                <span>{item[0]}</span>
                <strong className={`mood ${item[2]}`}>{item[1]}</strong>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>😂 Chaos Meter</h3>
            {chaos.map((club) => (
              <div className="chaos-row" key={club[0]}>
                <span>{club[0]}</span>
                <div className="bar">
                  <div style={{ width: `${club[1]}%` }} />
                </div>
                <strong>{club[1]}</strong>
              </div>
            ))}
          </div>
          /*
          <div className="card">
            <h3>📰 Daily Briefing</h3>
          
            {!briefing ? (
              <p>No briefing generated yet.</p>
            ) : (
              <>
                <h2>{briefing.title}</h2>
                <p className="hero-summary">{briefing.summary}</p>
                <div className="article-body">
                  {briefing.content}
                </div>
              </>
            )}
          </div>
          */

          /*
          <div className="card subscribe">
            <h3>📩 Get PitchIntel Daily</h3>
            <p>5-minute football briefing every morning.</p>
          
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          
            <button onClick={handleSubscribe}>
              Subscribe
            </button>
          
            {subscribeMessage && (
              <p className="subscribe-message">
                {subscribeMessage}
              </p>
            )}
          </div>          
          */
          
        </aside>
      </main>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
