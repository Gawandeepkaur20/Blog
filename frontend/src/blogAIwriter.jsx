import React, { useState, useContext } from "react";
import axios from "axios";
import "./blogAIwriter.css";
import { useNavigate } from "react-router-dom";
import { BlogContext } from "./context/BlogContext";

const BlogAIWriter = () => {
  const [topic, setTopic] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState("");
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [loadingSEO, setLoadingSEO] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setBlogData } = useContext(BlogContext);

  const handleGenerateBlog = async () => {
    if (!topic.trim()) return;
    setLoadingBlog(true);
    setGeneratedBlog("");
    setSuggestedTitle("");
    setTags([]);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/generate-blog", {
        topic,
      });
      setGeneratedBlog(res.data.blog);
    } catch (err) {
      console.error("Error generating blog:", err);
      setError(" Failed to generate blog.");
    } finally {
      setLoadingBlog(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!generatedBlog.trim()) {
      setError("Please generate the blog first.");
      return;
    }

    setLoadingSEO(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/seo-suggestions", {
        content: generatedBlog,
      });

      setSuggestedTitle(res.data.title);
      setTags(res.data.tags);
    } catch (err) {
      console.error("SEO Suggestion failed:", err);
      setError(" Failed to get SEO suggestions.");
    } finally {
      setLoadingSEO(false);
    }
  };

  const handleAccept = () => {
    setBlogData({
      title: suggestedTitle,
      content: generatedBlog,
      tags: tags,
    });

    navigate("/write");
  };

  const handleReject = () => {
    setGeneratedBlog("");
    setSuggestedTitle("");
    setTags([]);
    setTopic("");
    setError("");
  };

  return (
    <div className="blog-generator">
      <h2>📝 AI Blog Generator & SEO</h2>
      <input
        type="text"
        placeholder="Enter blog topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={handleGenerateBlog} disabled={loadingBlog}>
        {loadingBlog ? "Generating..." : "Generate Blog"}
      </button>

      {generatedBlog && (
        <div className="output">
          <h3>Generated Blog:</h3>
          <p>{generatedBlog}</p>

          <button onClick={handleGenerateSEO} disabled={loadingSEO}>
            {loadingSEO ? "Analyzing..." : "Generate SEO Title & Tags"}
          </button>

          {suggestedTitle && (
            <div className="seo-output">
              <p><strong>Suggested Title:</strong> {suggestedTitle}</p>
              <p><strong>Tags:</strong> {tags.join(", ")}</p>
            </div>
          )}

          <div className="button-group">
            <button className="accept-btn" onClick={handleAccept}>Accept</button>
            <button className="reject-btn" onClick={handleReject}>Reject</button>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default BlogAIWriter;
