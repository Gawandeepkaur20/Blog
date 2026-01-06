import { useState, useEffect, useContext } from "react";
import "./write.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { injectModels } from "../../Redux/injectModel";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BlogContext } from "../../context/BlogContext";
import { toast } from "react-toastify";
import Footer from "./../../components/footer";


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
  
const [showImagePromptInput, setShowImagePromptInput] = useState(false);
const [customImagePrompt, setCustomImagePrompt] = useState("");
const [showPrompt, setShowPrompt] = useState(false);
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const togglePromptBox = () => {
  setShowPrompt((prev) => !prev);
};



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
      const res = await axios.post(`${API_BASE_URL}/upload/blog`, data);
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

  // Validate required fields
  if (!title.trim() || !desc.trim()) {
    toast.error("Title and content are required.", {
      position: "top-left",
      style: {
        marginTop: "50px",
        backgroundColor: "#B9B2A8",
        color: "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
    return;
  }

  let filename = "";
  

  
  const newPost = {
    username: user.username,
    title,
    desc,
    tags,
    photo: filename || generatedImage,
  };
console.log("Creating Post Payload:", newPost);
  try {
    const response = await props.posts.createPost(newPost);
    if (response?.success) {
      toast.success(" Blog published!", {
        position: "top-left",
        autoClose: 3000,
        style: {
          marginTop: "50px",
          backgroundColor: "#d4edda",
          color: "#155724",
          fontFamily: "'Wix Madefor Display', serif"
        }
      });
      navigate("/");
    } else {
      toast.error(response?.message || "Failed to publish blog.", {
        position: "top-left",
        style: {
          marginTop: "50px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          fontFamily: "'Wix Madefor Display', serif"
        }
      });
    }
  } catch (error) {
    console.error("Creating Post error:", error);
    toast.error("Something went wrong while publishing.", {
      position: "top-left",
      style: {
        marginTop: "50px",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
  }
  
};



const handleGenerateBlog = async () => {
  if (!topic.trim()) return;

  // Show loading toast on the left
  const toastId = toast.loading("✍️ Generating blog...", {
    position: "top-left",
    style: {
       marginTop: "50px",
      backgroundColor: "#B9B2A8", // your light theme
      color: "#3b2f2f",           // dark text
      fontFamily: "'Wix Madefor Display', serif"
    }
  });

  setLoadingBlog(true);
  setGeneratedBlog("");
  setSuggestedTitle("");
  setTags([]);
  setError("");

  try {
    const res = await axios.post(`${API_BASE_URL}/api/generate-blog`, { topic });
    const blog = res.data.blog || "";

    setGeneratedBlog(blog);
    setDesc(blog);
    setShowSEO(true);

    toast.update(toastId, {
      render: " Blog generated!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      position: "top-left",
      style: {
          marginTop: "50px",
        backgroundColor:"#B9B2A8", // dark background
        color:  "#3b2f2f",              // white text
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
  } catch (err) {
    console.error("Error generating blog:", err);
    setError("Failed to generate blog.");

    toast.update(toastId, {
      render: "Error generating blog!",
      type: "error",
      isLoading: false,
      autoClose: 3000,
      position: "top-left",
      style: {
          marginTop: "50px",
        backgroundColor: "#B9B2A8", // error background
        color: "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
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
      const res = await axios.post(`${API_BASE_URL}/api/seo-suggestions`, {
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

  

  const handleAIGenerate = () => {
    setShowTopicInput(true);
    setGeneratedBlog("");
    setSuggestedTitle("");
    setTags([]);
    setError("");
  };




// Trigger this on button click
const handleImageGenerate = async () => {
  const prompt = customImagePrompt.trim() || title || desc.slice(0, 100);
  
  if (!prompt) {
    toast.error(" Please enter a prompt to generate an image.", {
      position: "top-left",
      style: {
        marginTop: "50px",
        backgroundColor: "#3b2f2f",
        color:  "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
    return;
  }

  await fetchUnsplashImage(prompt);
};


 

const fetchUnsplashImage = async (prompt) => {
  const query = prompt;
  if (!title && !desc) {
    toast.error("❗ Please enter content before generating an image.", {
      position: "top-left",
      style: {
          marginTop: "50px",
        backgroundColor:"#B9B2A8" ,
        color:  "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
    return;
  }

  const toastId = toast.loading("🖼️ Generating image...", {
    position: "top-left",
    style: {
        marginTop: "50px",
      backgroundColor: "#B9B2A8",
      color: "#3b2f2f",
      fontFamily: "'Wix Madefor Display', serif"
    }
  });

  setImageLoading(true);
  setGeneratedImage("");

  try {
    const query = title || desc.slice(0, 100);
    const res = await axios.get("https://api.unsplash.com/photos/random", {
      params: { query, orientation: "landscape" },
      headers: {
        Authorization: `Client-ID 7jvInlMHF51ykGDUFmXZ0K5wEfIQgT78JHJnd3DqkdU`,
      },
    });

    const imageUrl = res.data?.urls?.regular;
    if (imageUrl) {
      setGeneratedImage(imageUrl);
      toast.update(toastId, {
        render: " Image generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: "top-left",
        style: {
            marginTop: "50px",
          backgroundColor: "#B9B2A8",
          color: "#3b2f2f",
          fontFamily: "'Wix Madefor Display', serif"
        }
      });
    } else {
      toast.update(toastId, {
        render: " No image found for the query.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: "top-left",
        style: {
            marginTop: "50px",
          backgroundColor: "#B9B2A8",
          color: "#3b2f2f",
          fontFamily: "'Wix Madefor Display', serif"
        }
      });
    }
  } catch (err) {
    console.error("Unsplash image fetch failed:", err);
    toast.update(toastId, {
      render: " Failed to fetch image from Unsplash.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
      position: "top-left",
      style: {
          marginTop: "50px",
        backgroundColor: "#B9B2A8",
        color: "#3b2f2f",
        fontFamily: "'Wix Madefor Display', serif"
      }
    });
  } finally {
    setImageLoading(false);
  }
};





  const handleAccept = () => {
    setTitle(suggestedTitle);
    setShowTopicInput(false);
    setShowSEO(false);
       setTags([...tags]); 
  };

  const handleReject = () => {
    setTopic("");
    setTitle("");
    setDesc("");
    setGeneratedBlog("");
    setSuggestedTitle("");
    setTags([]);
    setShowTopicInput(false);
    setShowSEO(true);
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
        
        <div className="button-row">
            <button className="writeSubmit" type="submit" disabled={uploading}>
              {uploading ? "Publishing..." : "Publish"}
            </button>
            <button type="button" className="ai-generator" onClick={handleAIGenerate}>
              AI Blog Generator
            </button>

 </div>
<div className="image-generator">
  <button type="button" onClick={togglePromptBox} className="ai-generator-button">
    AI Image Generator
  </button>

  {showPrompt && (
    <div className="prompt-box">
      <label htmlFor="imagePrompt">Enter a prompt for the image:</label>
      <input
        type="text"
        id="imagePrompt"
       value={customImagePrompt}
      onChange={(e) => setCustomImagePrompt(e.target.value)}
      placeholder="e.g. Developer writing blog at night"
      />
        <button type="button" onClick={handleImageGenerate}>
      {imageLoading ? "Generating..." : "Generate Image"}
    </button>
    </div>
  )}
</div>


         
     
      </div>
     
      <div className="editorBox">
  <ReactQuill
    className="writeEditor"
    theme="snow"
    value={desc}
    onChange={setDesc}
    placeholder="Tell your story..."
  />
{tags.length > 0 && (
  <div className="tag-display">
    <strong>Tags:</strong> {tags.join(", ")}
  </div>
)}

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

      {error && <p className="error">{error}</p>}
    </div>
  )}
</div>


           

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
       
     
    </form>
  
{/* <Footer /> */}

</div>
        
    );         
}

export default injectModels(["posts", "auth"])(Write);
