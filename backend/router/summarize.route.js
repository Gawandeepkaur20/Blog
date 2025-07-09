// // routes/summarize.js
// const express = require("express");
// const router = express.Router();
// const axios = require("axios");


// router.post("/summarize", async (req, res) => {
//   const { text } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.textcortex.com/v1/texts/summarize",
//       {
//         text,
//         language: "en",
//         sentences_number: 3,
//       },
//       {
//         headers: {
//           Authorization: `Bearer tc_YOUR_API_KEY`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     res.status(200).json({ summary: response.data.data[0].output });
//   } catch (error) {
//     console.error("Summarization error:", error?.response?.data || error.message);
//     res.status(500).json({ message: "Failed to summarize." });
//   }
// });

// module.exports = router;
