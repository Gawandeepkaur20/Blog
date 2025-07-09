const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

router.post("/generate-blog", async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Write a short blog post (150-200 words) on: "${topic}"`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const blogText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ blog: blogText });
  } catch (error) {
    console.error("Gemini Error:", error);
    
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

module.exports = router;
