import { Link } from "react-router-dom";
import "./post.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";

export default function Post({
  _id,
  categories = [],
  title,
  photo,
  desc,
  username,
  createdAt,
  likes = 0,
  views = 0
})  

{



  console.log("Post props:", username, _id);
  const [post, setPost] = useState(null);
  // Determine correct image source
  const imageSrc = photo
    ? photo.startsWith("http")
      ? photo
      : `http://localhost:5000/images/blog/${photo}`
    : "/fallback.jpg"; // Add fallback image in public folder

  return (
    <div className="post">
      <img className="postImg" src={imageSrc} alt="post" />

      <div className="postInfo">
        <div className="postCats">
          {categories.map((el) => (
            <span key={el} className="postCat">
              <Link className="link" to={`/posts?cat=${el}`}>
                {el}
              </Link>
            </span>
          ))}
        </div>

        <span className="postTitle">
          <Link to={`/post/${_id}`} className="link">
            {title || "Untitled"}
          </Link>
        </span>

        <hr />
         <div className="postMetaRow">
     <span className="postAuthor">By {username || "Unknown"}</span>
    
    <span className="postDate">🕒 {format(createdAt)}</span>
  </div>

        <p className="postDesc">
          
          <Link to={`/post/${_id}`} className="readMore"></Link>
        </p>

        <div className="post-info-bar">
          <span className="likes-count">👍 {likes}</span>
          <span className="views-count">{views} 👁️</span>
        </div>
      </div>
    </div>
  );
}
