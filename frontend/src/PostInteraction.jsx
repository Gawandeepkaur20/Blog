import React, { useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import './PostInteraction.css';
import EmojiPicker from "emoji-picker-react";

const PostInteraction = ({ post: initialPost, postId, currentUser }) => {
  const [post, setPost] = useState(initialPost || null);
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false); 

  const handleReact = async (action) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/post/${postId}/react`, {
        userId: currentUser._id,
        action,
      });

      setPost((prev) => {
        const newLikes = prev?.likes?.filter(id => id !== currentUser._id) || [];
        const newDislikes = prev?.dislikes?.filter(id => id !== currentUser._id) || [];

        if (action === "like") newLikes.push(currentUser._id);
        if (action === "dislike") newDislikes.push(currentUser._id);

        return {
          ...prev,
          likes: newLikes,
          dislikes: newDislikes,
        };
      });
    } catch (err) {
      console.error("React failed:", err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/post/${postId}/comment`, {
        userId: currentUser._id,
        username: currentUser.username,
        text: comment,
      });

      setPost((prev) => ({
        ...prev,
        comments: [
          ...(Array.isArray(prev?.comments) ? prev.comments : []),
          {
            userId: currentUser._id,
            username: currentUser.username,
            text: comment,
            createdAt: new Date().toISOString(),
          },
        ],
      }));

      setComment("");
      setShowPicker(false);
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const handleCancel = () => {
    setComment("");
    setShowPicker(false);
  };

  const handleEmojiClick = (emojiData) => {
    setComment(prev => prev + emojiData.emoji);
  };

  if (!post) return <div>Loading post...</div>;

  const hasLiked = post.likes?.includes(currentUser._id);
  const hasDisliked = post.dislikes?.includes(currentUser._id);

  return (
  <div className="post-card-wrapper">
    {/* Reactions */}
    <div className="reactions-row">
      <button
        onClick={() => handleReact("like")}
        className={`icon-button ${hasLiked ? "active-like" : ""}`}
      >
        👍 <span>{post.likes?.length || 0}</span>
      </button>

      <button
        onClick={() => handleReact("dislike")}
        className={`icon-button ${hasDisliked ? "active-dislike" : ""}`}
      >
        👎 <span>{post.dislikes?.length || 0}</span>
      </button>
    </div>

    {/* Comment Section */}
    <div className="comment-section">
  <div className="comment-input-wrapper">
    <input
      type="text"
      placeholder="Drop a comment..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />

    {/* Quick emoji picker inside input wrapper */}
    <div className="emoji-picker">
      {["😄", "❤️", "🔥"].map((emoji) => (
        <span
          key={emoji}
          className="emoji-btn"
          onClick={() => setComment((prev) => prev + emoji)}
        >
          {emoji}
        </span>
      ))}

      
    </div>

  </div>

<div className="emoji-button">
  {/* Emoji Toggle Button */}
  <button
    onClick={() => setShowPicker((prev) => !prev)}
    className="emoji-toggle"
  >
    😀
  </button>

  {/* Emoji Picker Box */}
  {showPicker && (
    <div className="emoji-picker-box">
      <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
    </div>
  )}

  {/* Buttons SIDE BY SIDE */}
  <div className="comment-buttons">
    <button onClick={handleCancel} className="cancel-btn">Cancel</button>
    <button onClick={handleComment} className="comment-btn">Comment</button>
  </div>
</div>

 

      {/* Display existing comments */}
      <ul>
        {Array.isArray(post?.comments) &&
          post.comments.map((c, idx) => (
            <li key={idx}>
              <div className="comment-header">
                <strong>{c.username}</strong>
                <small>{format(c.createdAt)}</small>
              </div>
              <p>{c.text}</p>
            </li>
          ))}
      </ul>
    </div>
  </div>
);
}
export default PostInteraction;
