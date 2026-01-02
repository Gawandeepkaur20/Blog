const express = require("express");
const app = express.Router();
const User = require("../models/user.model");
const Post = require("../models/post.model");
const authentication = require("../middlewares/authentication");
const slugify = require("slugify");





// GET /api/posts/search-suggestions?q=keyword
app.get("/search-suggestions", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { "comments.text": { $regex: query, $options: "i" } }
      ]
    }).select("_id title");

    res.json(posts);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// GET ALL THE POST
app.get("/all", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({ categories: { $in: [catName] } });
    } else {
      posts = await Post.find();
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET THE POST
app.get("/:id", authentication, async (req, res) => {
 console.log(req.userId, ":req.userId"); 
 console.log(req?.user?.username || "No user", ":username");
  const postId = req.params.id;
  console.log(postId,'postIdpostId');
  try {
    const post = await Post.find({ _id: postId });
    res.send({ success: true, msg: post });
    console.log(post, "post of single user.");
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
    console.log(err, "err is getting single user post.");
  }
});
// routes/post.js or similar
// GET /api/post/:identifier
app.get("/post/:identifier", async (req, res) => {
  const { identifier } = req.params;

  try {
    let post;

    // Check if the identifier is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    if (isValidObjectId) {
      post = await Post.findById(identifier);
    } else {
      post = await Post.findOne({ slug: identifier }); // Assuming slug is a field in your model
    }

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// routes/post.js
// app.get("/posts", async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 20;
//   const skip = (page - 1) * limit;

//   try {
//     const posts = await Post.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json({ success: true, posts });
//   } catch (err) {
//     console.error("Error in /load-more:", err);
//     res.status(500).json({ success: false, message: "Failed to load more posts" });
//   }
// });
// POST /api/user/:id/follow


//CREATE
app.post("/create", authentication, async (req, res) => {
  const { title,tags, desc, username,photo,...rest } = req.body;

  if (!title || !desc || !username || !tags) {
    return res
      .status(400)
      .json({ success: false, message: "Title and descrition are required" });
  }
    const slug = `${slugify(title, {
    lower: true,
    strict: true,
  })}-${Date.now()}`;

  let imagePath = "";
    if (photo?.startsWith("http")) {
      // External image like Unsplash
      imagePath = photo;
    } else {
      // Local uploaded file (filename from /upload/blog)
      imagePath = `/images/blog/${photo}`;
    }

  console.log(req.userId, "req.userId");
  const newPost = new Post({
    title,
    desc,
    tags,
    slug,
    username:req.user?.username,
    userId: req.userId,
    photo:imagePath,
    ...rest,
  });

  try {
    const savedPost = await newPost.save();

    res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: savedPost,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({
      success: false,
      message: "Error saving post",
      error: err.message,
    });
  }
});

//UPDATE POST
app.put("/update/:id", authentication, async (req, res) => {
  const postId = req.params.id;
  console.log(postId,'postId');
  try {
    const post = await Post.findById({_id: postId});
    console.log(post, "postpostpostpost");
    post.title = req.body.title;
    post.desc = req.body.desc;
   const updatedPost= await post.save();
    
    res.send({ success: true, msg: "Updated Successfully", msg:updatedPost });
    console.log(updatedPost, ":their is updated post");
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});

// DELETE
app.delete("/delete/:id", authentication, async (req, res) => {
  const postId=req.params.id;
  console.log(postId,'delete postid');
  try {
    await Post.findByIdAndDelete({ _id: postId });
    res.send({ success: true, status: 200, msg: "Deleted Successfully" });
    console.log("delete successfully.");
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});
// PUT /post/:id/react
app.put("/:id/react", async (req, res) => {
  const { userId, action } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    // Remove from both
    post.likes = post.likes.filter(id => id.toString() !== userId);
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId);

    // Add to correct array
    if (action === "like") post.likes.push(userId);
    if (action === "dislike") post.dislikes.push(userId);

   const updatedPost = await post.save(); 
    return res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to update reactions" });
  }
});


// Add a comment
app.post("/:id/comment", async (req, res) => {
  const { userId, username, text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ userId, username, text });
    await post.save();
    res.status(200).json({ message: "Comment added successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
// In routes/post.js or similar
// app.put("/:id/view", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     post.views = (post.views || 0) + 1;
//     await post.save();
//     res.status(200).json("View count incremented");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
app.put("/:id/view", async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.views = (post.views || 0) + 1;
    await post.save();

    res.status(200).json({ message: "View count updated", views: post.views });
  } catch (err) {
    console.error("Error in /post/:id/view:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});



// GET THE POST (with populated likes, dislikes, and comments)
app.get("/:id", authentication, async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId)
      .populate("likes", "username profilePic")
      .populate("dislikes", "username profilePic")
      .populate("comments.userId", "username profilePic");

    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    res.send({ success: true, msg: post });
  } catch (err) {
    console.error("Error getting post:", err);
    res.status(500).json({ success: false, msg: err.message });
  }
});


// GET ALL MY POST
app.get("/mypost/posts", authentication, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId });
    res.send({ success: true, msg: posts });
    console.log(posts, "posts");
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Something went wrong", details: err });
    console.log(err, "error in getting my post");
  }
});


module.exports = app;
