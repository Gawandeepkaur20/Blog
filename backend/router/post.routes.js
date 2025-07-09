const express = require("express");
const app = express.Router();
const User = require("../models/user.model");
const Post = require("../models/post.model");
const authentication = require("../middlewares/authentication");

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
  console.log(req.user_.id, ":req.user_.id");
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

//CREATE
app.post("/create", authentication, async (req, res) => {
  const { title, desc, username,photo } = req.body;

  if (!title || !desc || !username) {
    return res
      .status(400)
      .json({ success: false, message: "Title and descrition are required" });
  }
  console.log(req.userId, "req.userId");
  const newPost = new Post({
    title,
    desc,
    username,
    userId: req.userId,
    photo,
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
app.put("/:id/view", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.views = (post.views || 0) + 1;
    await post.save();
    res.status(200).json("View count incremented");
  } catch (err) {
    res.status(500).json(err);
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
