// import { useState } from "react";
// import axios from "axios";

// function ImageGenerator({ topic, onImageGenerated }) {
//   const [loading, setLoading] = useState(false);
//   const [generatedImage, setGeneratedImage] = useState("");

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post("/api/generate-image", { prompt: topic });
//       setGeneratedImage(res.data.imageUrl);
//       onImageGenerated(res.data.imageUrl); // callback to parent
//     } catch (err) {
//       console.error("Image generation failed:", err);
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <button onClick={handleGenerate} disabled={loading}>
//         {loading ? "Generating..." : "Generate AI Image"}
//       </button>

//       {generatedImage && (
//         <div className="preview-img">
//           <img src={generatedImage} alt="Generated Blog Visual" />
//         </div>
//       )}
//     </div>
//   );
// }
