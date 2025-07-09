// components/SEOSuggester.jsx
import React, { useState } from "react";
import axios from "axios";

const SEOSuggester = ({ blogContent, onTitleSuggest }) => {
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!blogContent.trim()) {
      setError("Please enter content first.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post("http://localhost:5000/api/seo-suggestions", {
        content: blogContent,
      });

      setSuggestedTitle(res.data.title);
      setTags(res.data.tags);
      if (onTitleSuggest) onTitleSuggest(res.data.title);
    } catch (err) {
      console.error("SEO Suggestion failed:", err);
      setError("Failed to get suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seo-suggester mt-3 p-3 border rounded">
      <button
        type="button"
        onClick={handleGenerate}
        className="seo-generate-btn"
      >
        {loading ? "Generating..." : "Generate SEO Title & Tags"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {suggestedTitle && (
        <div>
          <p><strong>Suggested Title:</strong> {suggestedTitle}</p>
        </div>
      )}
      {tags.length > 0 && (
        <p><strong>Tags:</strong> {tags.join(", ")}</p>
      )}
    </div>
  );
};

export default SEOSuggester;
