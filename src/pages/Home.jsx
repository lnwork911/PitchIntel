import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [briefing, setBriefing] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const [storiesCount, setStoriesCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [articles, setArticles] = useState([]);

  const [sources, setSources] = useState([]);
  
  useEffect(() => {
    async function loadData() {

      const { data: sourceData, error: sourceError } =
        await supabase
          .from("news_sources")
          .select("*")
          .order("published_at", { ascending: false })
          .limit(5);
      
      if (sourceError) {
        console.error(sourceError);
      }
      
      setSources(sourceData || []);
          
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

      const { data: briefingData } = await supabase
      .from("daily_briefings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

      const { count: subscribersTotal } =
        await supabase
          .from("subscribers")
          .select("*", {
            count: "exact",
            head: true
        });
      
      
      const { count: storiesTotal } =
        await supabase
          .from("ai_articles")
          .select("*", {
            count: "exact",
            head: true
        });

const { data: articlesData, error: articlesError } =
  await supabase
    .from("ai_articles")
    .select("*")
    .order("created_at", {
      ascending: false
    })
    .limit(5);

if (articlesError) {
  console.error(articlesError);
}

setArticles(articlesData || []);
      

      setSubscriberCount(subscribersTotal || 0);      
      setStoriesCount(storiesTotal || 0);     
      setStory(storyData?.[0] || null);
      setMatches(matchData || []);
      setBriefing(briefingData?.[0] || null);
      setLoading(false);
    }
   
    loadData();
  }, []);

  async function handleSubscribe() {
  
    console.log("EMAIL:", email);
  
    try {
  
      const response = await fetch(
        "/.netlify/functions/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email
          })
        }
      );
  
      const result =
        await response.json();
  
      console.log(result);
  
      setSubscribeMessage(
        result.message ||
        result.error
      );
  
    } catch(err) {
  
      console.error(err);
  
      setSubscribeMessage(
        "Failed"
      );
    }
  }  
  
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

        <div className="nav-links">
          <Link to="/">
            Home
          </Link>
        
          <Link to="/articles">
            Articles
          </Link>
        
          <Link to="/world-cup">
            World Cup
          </Link>
        
        </div>        
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
<section className="market-strip">

  <div className="market-item">
    ⚽ EPL
    <strong>Liverpool ↑</strong>
  </div>

  <div className="market-item">
    🌎 WC26
    <strong>Argentina ↑</strong>
  </div>

  <div className="market-item">
    ❤️ Fan Mood
    <strong>Positive</strong>
  </div>

  <div className="market-item">
    📈 Momentum
    <strong>Rising</strong>
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
                      <img
                        className="team-logo"
                        src={match.home_crest}
                        alt={match.home_team}
                      />
                      <strong>{match.home_team}</strong>
                      <span>vs</span>
                      <strong>{match.away_team}</strong>
                      <img
                        className="team-logo"
                        src={match.away_crest}
                        alt={match.away_team}
                      />
                    </div>

                    <p>
                      {match.match_date
                        ? new Date(match.match_date).toLocaleDateString()
                        : "Date TBD"}
                    </p>


<div className="match-score">

  <span className="score-tag">
    Importance 86
  </span>

  <span className="score-tag">
    Upset Risk 28%
  </span>

</div>

<p className="storyline">
  Key storyline developing.
</p>                    
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="right-column">

<div className="card worldcup-card">
  <h3>🌎 World Cup 2026 Watch</h3>

  <p className="mini-label">
    AI Power Rankings
  </p>    
  
  <div className="rank-row">
    <span>Argentina</span>
    <strong>#1</strong>
  </div>

  <div className="rank-row">
    <span>France</span>
    <strong>#2</strong>
  </div>

  <div className="rank-row">
    <span>Spain</span>
    <strong>#3</strong>
  </div>

  <div className="rank-row">
    <span>England</span>
    <strong>#4</strong>
  </div>

  <div className="rank-row">
    <span>Brazil</span>
    <strong>#5</strong>
  </div>  
</div>          

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
  
<div className="card">
  <h3>📊 Platform Metrics</h3>

  <div className="metric-grid">
    <div className="metric-card">
      <h2>{storiesCount}</h2>
      <p>Stories</p>
    </div>

    <div className="metric-card">
      <h2>{subscriberCount}</h2>
      <p>Subscribers</p>
    </div>

    <div className="metric-card">
      <h2>{matches.length}</h2>
      <p>Matches</p>
    </div>
  </div>  
</div> 

<div className="card">
  <h3>🧠 Source Intelligence</h3>

  {sources.length === 0 ? (
    <p>No source intelligence yet. Run sync-news.</p>
  ) : (
    sources.map((source) => (
      <div key={source.id} className="source-item">
        <strong>{source.source}</strong>
        <p>{source.title}</p>

        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="source-link"
          >
            Read original →
          </a>
        )}
      </div>
    ))
  )}
</div>
          
<div className="card">          
  <h3>
    📰 Recent Stories
  </h3>

  {articles.map(article => (          
      <Link
        key={article.id}
        to={`/article/${article.id}`}
        className="archive-item"
      >
        <h4>{article.title}</h4>
      
        <p>
          {article.summary ||
            "AI football intelligence story"}
        </p>
      </Link>      
    ))}
</div> 
          
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


<div className="card subscribe">
  <h3>📩 Get PitchIntel Daily</h3>
  <p>
  Join football fans receiving
  a 5-minute intelligence briefing
  every morning.
</p>
<div className="subscriber-count">
  {subscriberCount}+ readers
</div>  

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
