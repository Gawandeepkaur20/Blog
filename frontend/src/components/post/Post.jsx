import { Link } from "react-router-dom";
import "./post.css";
import { format } from "timeago.js";

export default function Post({ _id, categories = [], title, photo, desc, createdAt,likes=0,views=0 }) {
  const PF = 'http://localhost:5000/images/blog/';

  return (
    <div className="post">
      {photo && <img className="postImg" src={PF + photo} alt="post" />}
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
            {title}
          </Link>
        </span>
        <hr />
        <span className="postDate">{format(createdAt)}</span>
        <div className="postDesc" dangerouslySetInnerHTML={{ __html: desc }}></div>
          <div className="post-info-bar">
        <span className="likes-count">👍 {likes}</span>
        <span className="views-count">{views} 👁️</span>
      </div>
      </div>
    </div>
  );
}
