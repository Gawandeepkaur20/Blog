const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");

// Search blog titles or tags that match a keyword
router.get("/suggest", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const suggestions = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } }
      ]
    })
      .limit(5)
      .select("title");

    res.json(suggestions.map(s => s.title));
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
