return (
  <div className="app">
    const { data: articles } =
      await supabase
        .from("ai_articles")
        .select("*")
        .order("created_at", {
          ascending: false
        });
  </div>
