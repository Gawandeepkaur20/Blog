import { useState, useEffect, useContext } from "react";
import "./write.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { injectModels } from "../../Redux/injectModel";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BlogContext } from "../../context/BlogContext";

function Write(props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [grammarSuggestions, setGrammarSuggestions] = useState([]);
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState([]);
  const [generatedImage, setGeneratedImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState("");
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [loadingSEO, setLoadingSEO] = useState(false);
  const [error, setError] = useState("");

  const { user, getUser } = props.auth;
  const { blogData, setBlogData } = useContext(BlogContext);

  useEffect(() => {
    if (blogData.title || blogData.content) {
      setTitle(blogData.title);
      setDesc(blogData.content);
      setTags(blogData.tags || []);
      setBlogData({ title: "", content: "", tags: [] });
    }
  }, [blogData, setBlogData]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) getUser();
  }, [user, getUser]);

  const uploadImage = async () => {
    if (!file) return "";
    const data = new FormData();
    const filename = Date.now() + "-" + file.name.replace(/\s+/g, "_");
    data.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/upload/blog", data);
      setUploading(false);
      return res.data.filename;
    } catch (err) {
      setUploading(false);
      console.error("Upload Error:", err);
      alert("Image upload failed");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.username) return navigate("/login");

    const filename = await uploadImage();

    const newPost = {
      username: user.username,
      title,
      desc,
      tags,
      photo: filename || generatedImage,
    };

    try {
      const response = await props.posts.createPost(newPost);
      if (response?.success) navigate("/");
    } catch (error) {
      console.error("Creating Post error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleGenerateBlog = async () => {
    if (!topic.trim()) return;
    setLoadingBlog(true);
    setGeneratedBlog("");
    setSuggestedTitle("");
    setTags([]);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/generate-blog", { topic });
      const blog = res.data.blog || "";
      setGeneratedBlog(blog);
      setDesc(blog);
      setShowSEO(true);
    } catch (err) {
      console.error("Error generating blog:", err);
      setError("Failed to generate blog.");
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
      setError("Failed to get SEO suggestions.");
    } finally {
      setLoadingSEO(false);
    }
  };

  const handleImageGenerate = async () => {
    if (!title) return alert("Please enter a topic first.");
    try {
      setImageLoading(true);
      const res = await axios.post("http://localhost:5000/api/generate-image", { prompt: title });
      setGeneratedImage(res.data.imageUrl);
    } catch (err) {
      console.error("Image generation failed:", err);
      alert("Failed to generate image.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleAIGenerate = () => {
    setShowTopicInput(true);
    setGeneratedBlog("");
    setSuggestedTitle("");
    setTags([]);
    setError("");
  };

  const handleAccept = () => {
    setTitle(suggestedTitle);
    setShowTopicInput(false);
    setShowSEO(false);
  };

  const handleReject = () => {
    setTopic("");
    setTitle("");
    setDesc("");
    setGeneratedBlog("");
    setSuggestedTitle("");
    setTags([]);
    setShowTopicInput(false);
    setShowSEO(false);
    setError("");
  };

  return (
   
  <div className="write">
    {file && <img className="writeImg" src={URL.createObjectURL(file)} alt="upload preview" />}
    {!file && generatedImage && <img className="writeImg" src={generatedImage} alt="AI generated" />}

    <form className="writeForm" onSubmit={handleSubmit}>
      <div className="writeFormGroup">
        <label htmlFor="fileInput">
          <i className="writeIcon fas fa-plus">+</i>
        </label>
        <input
          id="fileInput"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        {showTopicInput ? (
          <input
            className="writeInput"
            placeholder="Enter blog topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await handleGenerateBlog();
              }
            }}
          />
        ) : (
          <input
            className="writeInput"
            placeholder="Title"
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
      </div>

      <div className="writeFormGroup">
        <ReactQuill
          className="writeInput"
          theme="snow"
          value={desc}
          onChange={setDesc}
          placeholder="Tell your story..."
        />
      </div>

      {/* SEO Section */}
      {showSEO && (
        <div className="seo-section">
          <button
            type="button"
            className="seo-generate-btn"
            onClick={handleGenerateSEO}
            disabled={loadingSEO}
          >
            {loadingSEO ? "Analyzing..." : "Generate SEO Title & Tags"}
          </button>

          {suggestedTitle && (
            <div className="seo-box">
              <p><strong>Suggested Title:</strong> {suggestedTitle}</p>
              <p><strong>Tags:</strong> {Array.from(new Set(tags)).join(", ")}</p>

              <div className="button-group">
                <button className="accept-btn" type="button" onClick={handleAccept}>
                  Accept
                </button>
                <button className="reject-btn" type="button" onClick={handleReject}>
                  Reject
                </button>
              </div>
            </div>
          )}

          <div className="button-row">
            <button className="writeSubmit" type="submit" disabled={uploading}>
              {uploading ? "Publishing..." : "Publish"}
            </button>
            <button type="button" className="ai-generator" onClick={handleAIGenerate}>
              AI Blog Generator
            </button>
            <button type="button" className="image-generator" onClick={handleImageGenerate}>
              {imageLoading ? "Generating..." : "AI Image Generator"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {grammarSuggestions.length > 0 && (
            <div className="grammar-suggestions">
              <h4>Grammar Suggestions:</h4>
              <ul>
                {grammarSuggestions.map((item, idx) => (
                  <li key={idx}>
                    <strong>Issue:</strong> {item.message} <br />
                    <strong>Suggestion:</strong> {item.replacements.map((r) => r.value).join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary && (
            <div className="summary-box">
              <h4>Post Summary:</h4>
              <p>{summary}</p>
            </div>
          )}
        </div>
      )}
    </form>
  


</div>
        
    );         
}

export default injectModels(["posts", "auth"])(Write);
