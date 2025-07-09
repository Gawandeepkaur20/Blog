import React, { useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import "./editor.css";

function BlogEditor({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let filename = "";

    // Upload file
    if (file) {
      const data = new FormData();
      filename = Date.now() + "-" + file.name.replace(/\s+/g, "_");
      data.append("file", file);

      try {
        await axios.post("http://localhost:5000/upload", data);
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to upload image.");
        setUploading(false);
        return;
      }
    }

    // Post creation
    const newPost = {
      title,
      desc: content,
      photo: filename,
      username: localStorage.getItem("username") || "demo", // update with your auth logic
    };
console.log(newPost);
    try {
      const res = await axios.post("http://localhost:5000/post/create", newPost, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
console.log(res);
      onPostCreated(res.data.data);
      setTitle("");
      setContent("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.log(err);
      console.error("Post creation failed:", err);
      alert("Failed to create post.");
    }

    setUploading(false);
  };

  return (
    <div className="editor-container">
      <h2>Create your blog post</h2>

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="preview" className="editorImg" />
        </div>
      )}

      <form className="editorForm" onSubmit={handleSubmit}>
        <div className="editorGroup">
          <label htmlFor="fileInput">
            <i className="editorIcon">+</i>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <input
            className="editorInput"
            placeholder="Title"
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="editorGroup">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Tell your story..."
          />
        </div>

        <button className="editorSubmit" type="submit" disabled={uploading}>
          {uploading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

export default BlogEditor;
