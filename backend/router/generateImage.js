const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(`Create a detailed image prompt for: ${prompt}. Only give the prompt for an image generation AI.`);
    const imagePrompt = result.response.text();

    // OPTIONAL: Use imagePrompt to call OpenAI's DALL·E or another model
    // For now, mock response
    res.json({ imageUrl: `https://dummyimage.com/600x400/000/fff&text=${encodeURIComponent(prompt)}` });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

module.exports = router;
