import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./singlePost.css";
import { format } from "timeago.js";
import { injectModels } from "../../Redux/injectModel";
import PostInteraction from "../../PostInteraction";
import axios from "axios";
import Spinner from "../../components/spinner"
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";


function SinglePost(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [desc, setDesc] = useState("");
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [tags,setTags]=useState("");
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const pf = "${API_BASE_URL}/images/blog/";

  const { user, getUser } = props.auth;
  const shareUrl = window.location.href;
const shareTitle = post?.title || "Check this blog post!";

// Copy to clipboard
const handleCopyLink = () => {
  navigator.clipboard.writeText(shareUrl);
  toast.success("Link copied to clipboard!", {
    position: "top-left",
    style: {
      marginTop: "50px",
      backgroundColor: "#B9B2A8",
      color: "#3b2f2f",
      fontFamily: "'Wix Madefor Display', serif"
    }
  });
};

  useEffect(() => {
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await props.posts.getPostById(id);
      const postData = Array.isArray(response) ? response[0] : response;

      if (!postData || !postData.title) {
        setError("Post not found or invalid response");
        setLoading(false);
        return;
      }

      setPost(postData);
      setTitle(postData.title);
     setDesc(typeof postData.desc === "string" ? postData.desc : "");
      setTags(
        Array.isArray(postData.tags)
          ? postData.tags
          : postData.tags?.split(",").map(tag => tag.trim())
      );
    } catch (err) {
      console.error("Failed to fetch post:", err);
      setError("Failed to load post. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchPost();
}, [id]);


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      getUser();
    }
  }, [user, getUser]);


  const handleDelete = async () => {
  try {
    const response = await props.posts.deletePostById(id);
    console.log("Delete response:", response);

   if (
  response?.success ||
  response?.msg?.toLowerCase().includes("deleted")
) {
  navigate("/");
} else {
  // toast.error("Delete failed: " + (response?.msg || "Unexpected response"));
}

toast.success("Post deleted successfully!", {
  position: "top-left",
  autoClose: 3000,
  style: {
    marginTop: "50px",
    backgroundColor: "#B9B2A8", // match theme
    color: "#fff",              // white text
    fontFamily: "'Wix Madefor Display', serif"
  }
});

navigate("/");

  } catch (error) {
    console.error("Delete failed:", error);
   
    toast.error("Could not delete the post.", {
  position: "top-left",
  autoClose: 3000,
  style: {
    marginTop: "50px",
    backgroundColor: "#B9B2A8", // match theme
    color: "#fff",              // white text
    fontFamily: "'Wix Madefor Display', serif"
  }
});

  }
};


  const handleUpdate = async () => {
    try {
      const updatedPost = { title, desc,tags };
      const response = await props.posts.updatePostById(id, updatedPost);
      console.log("Update response:", response);
      setUpdateMode(false);
      setPost({ ...post, title, desc });
      
      toast.success("Post updated successfully!", {
  position: "top-left",
  autoClose: 3000,
  style: {
    marginTop: "50px",
    backgroundColor: "#B9B2A8", // match theme
    color: "#fff",              // white text
    fontFamily: "'Wix Madefor Display', serif"
  }
});
 // update local state
    } catch (error) {
      console.error("Update failed:", error);
    
     toast.success("Could not update the post.", {
  position: "top-left",
  autoClose: 3000,
  style: {
    marginTop: "50px",
    backgroundColor: "#B9B2A8", // match theme
    color: "#fff",              // white text
    fontFamily: "'Wix Madefor Display', serif"
  }
});

    }
  };
useEffect(() => {
  const incrementView = async () => {
    try {
      const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");

      // If the user hasn't viewed this post yet
      if (!viewedPosts.includes(id)) {
        await axios.put(`${API_BASE_URL}/post/${id}/view`);
        viewedPosts.push(id);
        localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
      }
    } catch (err) {
      console.error("Failed to update view count", err);
    }
  };

  incrementView();
}, [id]);


if (loading || !post) return ;



if (error) {
  return (
    <div className="error-state">
      <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
        {error}
      </p>
    </div>
  );
}

  
return (
  <div className="singlePost">
    <div className="singlePostWrapper">
      {post.photo && (
        <img
  className="singlePostImg"
  src={
    post.photo?.startsWith("http")
      ? post.photo
      :`${API_BASE_URL}/${post.photo}`
  }
  alt="Post"
/>

      )}

      <div className="postContainer">
        {/* TITLE + META ROW */}
      
<div className="postHeader">
  {/* Row 1: Title and edit/delete */}
  <div className="postTitleRow">
    {updateMode ? (
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="editTitleInput"
    placeholder="Edit title"
  />
) : (
  <h1 className="singlePostTitle">{post.title}</h1>
)}
    {post.username === user?.username && (
      <div className="singlePostEdit">
        <i onClick={() => setUpdateMode(true)}>✎</i>
        <i onClick={handleDelete}>🗑</i>
      </div>
    )}
  </div>

  {/* Row 2: Author and Time */}
  <div className="postMetaRow">
    
   <span className="postAuthor">By 
     <span className="divider"> </span>
  <Link to={`/user/${post.username}`} className="author-link">
    {post.username}
  </Link>
  </span>
    <span className="postDate">🕒 {format(post.createdAt)}</span>
  </div>
</div>



        {/* DESCRIPTION */}
        <div className="postBody">
          {updateMode ? (
            <ReactQuill
              className="quillEditor"
              theme="snow"
              value={desc}
              onChange={setDesc}
            />
          ) : (
            <div
              className="singlePostDesc"
              dangerouslySetInnerHTML={{ __html: post.desc }}
            />
          )}
{updateMode ? (
  <input
    type="text"
    value={tags}
    onChange={(e) => setTags(e.target.value)}
    className="editTagsInput"
    placeholder="Enter tags separated by commas"
  />
) : (
  tags && (
    <div className="postTags">
     <strong>Tags:</strong> {Array.isArray(tags) ? tags.join(", ") : tags}
    </div>
  )
)}
<div className="share-buttons">
  <strong>Share this post:</strong>

  <FacebookShareButton url={shareUrl} quote={shareTitle}>
    <FacebookIcon size={32} round />
  </FacebookShareButton>

  <TwitterShareButton url={shareUrl} title={shareTitle}>
    <TwitterIcon size={32} round />
  </TwitterShareButton>

  <WhatsappShareButton url={shareUrl} title={shareTitle}>
    <WhatsappIcon size={32} round />
  </WhatsappShareButton>

  <LinkedinShareButton url={shareUrl} title={shareTitle}>
    <LinkedinIcon size={32} round />
  </LinkedinShareButton>

  <button onClick={handleCopyLink} className="copyLinkBtn">
    📋 Copy Link
  </button>
</div>


        </div>

        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
             Update
          </button>
        )}
      </div>
    </div>

    <PostInteraction post={post} postId={id} currentUser={user} />
  </div>
);
}
export default injectModels(["posts", "auth"])(SinglePost);
 