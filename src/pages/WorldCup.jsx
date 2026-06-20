import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function WorldCup() {
  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadReport() {
      const { data, error } =
        await supabase
          .from("world_cup_intelligence")
          .select("*")
          .order("created_at", {
            ascending: false
          })
          .limit(1);

      if (error) {
        console.error(error);
      } else {
        setReport(data?.[0] || null);
      }

      setLoading(false);
    }

    loadReport();
  }, []);

  if (loading) {
    return <p>Loading world cup report...</p>;
  }

  if (!report) {
    return <p>No world cup report yet.</p>;
  }

  return (
    <div className="app">
      <div className="card">
        <h1>{report.title}</h1>

        <p className="hero-summary">
          {report.summary}
        </p>

        <div className="article-body">
          {report.content}
        </div>
      </div>
    </div>
  );
}
