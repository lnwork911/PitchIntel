import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Articles() {
  const [articles, setArticles] =
    useState([]);

  useEffect(() => {
    async function loadArticles() {
      const { data, error } =
        await supabase
          .from("ai_articles")
          .select("*")
          .order("created_at", {
            ascending: false
          });

      if (error) {
        console.error(error);
      } else {
        setArticles(data || []);
      }
    }

    loadArticles();
  }, []);

  return (
    <div className="app">
      <div className="card">
        <h1>All Articles</h1>

        {articles.map(article => (
          <div
            key={article.id}
            className="archive-item"
          >
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
