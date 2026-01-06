const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const { Router } = require("express");
const authentication = require("../middlewares/authentication");


// SIGNUP
app.post("/signup", async (req, res) => {
  const { email, password, username, profilePic } = req.body;

  // REGEX
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  // BASIC FIELD CHECKS
  if (!username || !email || !password) {
    return res.status(400).send({ msg: "All fields are required." });
  }

  // REGEX VALIDATION
  if (!emailRegex.test(email)) {
    return res.status(400).send({ msg: "Invalid email format." });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).send({
      msg: "Password must be at least 8 characters and include one letter and one number.",
    });
  }

  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).send({ msg: "User Already Exists" });
    }

    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        return res.status(500).send({ error: "Password hashing failed." });
      }

      const user = new User({
        email,
        password: hash,
        username,
        profilePic, // ✅ include this
      });

      await user.save();
      res.send({ success: true, user });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong." });
  }
});


// LOGIN
app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ success: false, msg: "User Not Found" });
  }
  console.log("user", user);
  const hash = user.password;
  bcrypt.compare(password, hash, function (err, result) {
    if (err) {
      res.send({ success: false, msg: "Something went wrong" });
    }
    
    if (result) {
      const token = jwt.sign(
  {
    userId: user._id,
    
    user_: {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic:user.profilePic
    },
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

      const { password, ...others } = user._doc;
      res.status(200).json({ success: true, token: token, user: others});
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    }
  });
});

//UPDATE
// app.put("/update/:id",authentication,async (req,res)=>{
//     if (req.userId === req.params.id) {
//         if (req.body.password) {
//           const salt = await bcrypt.genSalt(5);
//           req.body.password = await bcrypt.hash(req.body.password, salt);
//         }
//         try {
//           const user=await User.findById(req.params.id);
//           console.log(user,'user for updation');
//           user.username=req.body.username;
//           user.email=req.body.email;
//           user.profilePic=req.body.profilePic;
//           user.password=req.body.password;
//           user.bio=req.body.bio;

          
//           const updatedUser = await user.save();
//           console.log(updatedUser,'user is updated');
//           res.status(200).json({success:true,status:200,updatedUser});
//         } catch (err) {
//           res.status(500).json(err);
//         }
//       } else {
//         res.status(401).json("You can update only your account!");
//       }

// })
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/profiles/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// app.put("/update/:id", authentication, upload.single("file"), async (req, res) => {
//   const userId = req.params.id;
//   const { username, email, password, bio } = req.body;

//   try {
//     if (req.userId !== userId) {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const updateFields = {};

//     if (username) updateFields.username = username;
//     if (email) updateFields.email = email;
//     if (bio) updateFields.bio = bio;

//     // ✅ Handle new profile picture if uploaded
//     if (req.file) {
//       updateFields.profilePic = req.file.filename;
//     }

//     if (password) {
//       const salt = await bcrypt.genSalt(5);
//       updateFields.password = await bcrypt.hash(password, salt);
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateFields },
//       { new: true }
//     );

//     res.status(200).json({ success: true, user: updatedUser });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// app.put("/update/:id", authentication, async (req, res) => {
//   const userId = req.params.id;
//   const { username, email, password, bio, profilePic } = req.body;

//   if (req.userId !== userId) {
//     return res.status(403).json({ success: false, message: "Unauthorized" });
//   }

//   const updateFields = {};

//   if (username) updateFields.username = username;
//   if (email) updateFields.email = email;
//   if (bio) updateFields.bio = bio;

//   // ✅ THIS IS THE KEY FIX
//   if (profilePic) {
//     updateFields.profilePic = profilePic; // Cloudinary URL
//   }

//   if (password) {
//     const salt = await bcrypt.genSalt(5);
//     updateFields.password = await bcrypt.hash(password, salt);
//   }

//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     { $set: updateFields },
//     { new: true }
//   );

//   res.status(200).json({ success: true, user: updatedUser });
// });
app.put("/update/:id", authentication, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ success: false });
    }

    const { username, email, password, bio, profilePic } = req.body;

    const updateData = {
      username,
      email,
      bio,
    };

    if (profilePic) {
      updateData.profilePic = profilePic; // FULL URL ONLY
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});



app.get("/", authentication, async (req, res) => {
  try {
    // console.log('user', req.userId);
    const loggedInUserId = req.userId; 

    if(!loggedInUserId) {
      return res.status(404).json({success:false, message: "Id not found" });
    }

    const users = await User.findById(loggedInUserId);
    if (!users) {
      return res.status(404).json({succcess:false, message: "User not found" });
    }

    const user = users.toObject();

    res.status(200).json({success:true,user,msg:"succeccfully get user"});
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ success:false,message: "Server error" });
  }
});



app.post("/:id/follow", authentication, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow.followers.includes(req.userId)) {
      userToFollow.followers.push(req.userId);
      currentUser.following.push(userToFollow._id);
      await userToFollow.save();
      await currentUser.save();
      res.status(200).json({ success: true, message: "Followed successfully" });
    } else {
      res.status(400).json({ message: "Already following" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error following user", error: err.message });
  }
});

// POST /api/user/:id/unfollow
app.post("/:id/unfollow", authentication, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.userId
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.id
    );

    await userToUnfollow.save();
    await currentUser.save();

    res.status(200).json({ success: true, message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error unfollowing user", error: err.message });
  }
});
// GET /api/user/:username/followers-count
app.get("/:username/followers-count", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.json({
      followers: user.followers.length,
      following: user.following.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching counts" });
  }
});

// ✅ Get user profile by username + user's posts
// GET user profile by username
app.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also fetch posts created by this user
    const posts = await Post.find({ username: req.params.username });

    res.status(200).json({
      profile: {
        _id: user._id,
        username: user.username,
        bio: user.bio,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
      },
      posts,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// GET followers by username
app.get("/:username/followers", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const followers = await User.find({ _id: { $in: user.followers } }).select("username profilePic _id");
    res.json({ followers });
  } catch (err) {
    console.error("Error fetching followers:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET following by username
app.get("/:username/following", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = await User.find({ _id: { $in: user.following } }).select("username profilePic _id");
    res.json({ following });
  } catch (err) {
    console.error("Error fetching following:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// app.put("/update/:id", authentication, async (req, res) => {
//   const userId = req.params.id;
//   const { bio } = req.body;

//   try {
//     // Optional: ensure only user can edit their own bio
//     if (req.user.id !== userId) {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: { bio } },
//       { new: true }
//     );

//     res.status(200).json({ success: true, user: updatedUser });
//   } catch (err) {
//     console.error("Error updating bio:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });
  
app.delete("/delete/:id", authentication, async (req, res) => {
  if (req.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      console.log(user,'user...');
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({msg:"User has been deleted...",succes:true});
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (error) {
      console.error(error,'error in deleting user account');
      res.status(404).json({msg:"User not found!",success:false});
    }
  } else {
    res.status(401).json({msg:"You can delete only your account!",success:false});
  }
});

module.exports = app;
