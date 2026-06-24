import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./lib/supabase";

export default function StoryPage() {
const { id } = useParams();
const [story, setStory] = useState(null);

useEffect(() => {
async function loadStory() {
const { data } = await supabase
.from("ai_articles")
.select("*")
.eq("id", id)
.single();

  setStory(data);
}

loadStory();


}, [id]);

if (!story) return <p>Loading...</p>;

return ( <div className="story-page"> <div className="story-container"> <h1>{story.title}</h1>

  
    <p className="story-summary">
      {story.summary}
    </p>

    <div className="story-content">
      {story.content}
    </div>
  </div>
</div>


);
}
