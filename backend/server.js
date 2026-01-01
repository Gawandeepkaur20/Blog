const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const newsletterRoutes = require('./router/newsletter.route');
const user = require("./router/user.router");
const category = require("./router/category.route");
const post = require("./router/post.routes");
const seoRoutes = require("./router/seo");
const blogRoutes = require("./router/blogroute");

const app = express();

// ✅ Port and Mongo URI
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGODB_URL;

// ✅ CORS config
const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
};



// ✅ Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// ✅ Serve uploaded images statically
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use('/newsletter', newsletterRoutes);

// ✅ API Routes
app.use("/user", user);
app.use("/category", category);
app.use("/post", post);
app.use("/api", seoRoutes);
app.use("/api", blogRoutes);



// ✅ Ensure upload folders exist
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const blogImagesDir = path.join(__dirname, "public/images/blog");
const profileImagesDir = path.join(__dirname, "public/images/profiles");
ensureDirExists(blogImagesDir);
ensureDirExists(profileImagesDir);

// ✅ Multer setups
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, blogImagesDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileImagesDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const uploadBlogImage = multer({ storage: blogStorage });
const uploadProfileImage = multer({ storage: profileStorage });

// ✅ Blog image upload endpoint
app.post("/upload/blog", uploadBlogImage.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
  res.status(200).json({
    success: true,
    message: "Blog image uploaded successfully",
    filename: req.file.filename,
    filePath: `/images/blog/${req.file.filename}`,
  });
});


// ✅ Profile picture upload endpoint
app.post("/upload/profile", uploadProfileImage.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, message: "No file uploaded" });

  res.status(200).json({
    success: true,
    message: "Profile image uploaded successfully",
    filename: req.file.filename,
    filePath: `/images/profiles/${req.file.filename}`,
  });
});




// ✅ MongoDB connection and start server
// mongoose
//   .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error(err));
