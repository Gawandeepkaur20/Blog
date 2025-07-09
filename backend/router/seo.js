const express = require("express");
const app = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST route for SEO suggestions
app.post('/seo-suggestions', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'No content provided.' });

  try {
    // Prompt for Gemini
    const prompt = `
You are an SEO assistant. Based on the blog content below, generate:
1. A smart, catchy, SEO-optimized title.
2. A list of 5-7 relevant SEO tags.

Content:
${content}

Format:
Title: <title>
Tags: <comma-separated-tags>
    `;

    // Use Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content using the prompt
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }]
    });

    // Extract output
    const output = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse title and tags from the output
    const titleMatch = output.match(/Title:\s*(.*)/);
    const tagsMatch = output.match(/Tags:\s*(.*)/);

    res.json({
      title: titleMatch ? titleMatch[1].trim() : '',
      tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [],
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini AI failed." });
  }
});

module.exports = app;
