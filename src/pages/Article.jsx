import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Article() {
  const { id } = useParams();

  const [article, setArticle] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadArticle() {
      const { data, error } =
        await supabase
          .from("ai_articles")
          .select("*")
          .eq("id", id)
          .single();

      if (error) {
        console.error(error);
      } else {
        setArticle(data);
      }

      setLoading(false);
    }

    loadArticle();
  }, [id]);

  if (loading) {
    return <p>Loading article...</p>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }

  return (
    <div className="app">
      <div className="card">
        <h1>{article.title}</h1>

        <p className="hero-summary">
          {article.summary}
        </p>

        <div className="article-body">
          {article.content}
        </div>
      </div>
    </div>
  );
}
