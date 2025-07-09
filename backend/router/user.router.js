const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
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
app.put("/update/:id",authentication,async (req,res)=>{
    if (req.userId === req.params.id) {
        if (req.body.password) {
          const salt = await bcrypt.genSalt(5);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
          const user=await User.findById(req.params.id);
          console.log(user,'user for updation');
          user.username=req.body.username;
          user.email=req.body.email;
          user.password=req.body.password;

          
          const updatedUser = await user.save();
          console.log(updatedUser,'user is updated');
          res.status(200).json({success:true,status:200,updatedUser});
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can update only your account!");
      }

})

// app.put("/update/", authentication, async (req, res) => {
//   if (req.userId === req.params.id) {
//     if (req.body.password) {
//       const salt = await bcrypt.genSalt(5);
//       req.body.password = await bcrypt.hash(req.body.password, salt);
//     }
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,
//         { $set: req.body },
//         { new: true }
//       );
//       res.status(200).json({success:true,updatedUser,msg:'user details updated successfully'});
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(401).json({success:false ,msg:"You can update only your account!"});
//   }
//   console.log("BODY:", req.body);
//   console.log("PARAMS.ID:", req.params.id);
//   console.log("USERID FROM TOKEN:", req.userId);
// });


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


// app.get("/",authentication, async (req, res) => {
//     try {
//       const user = await User.findById(req.userId);
//       const { password, ...others } = user._doc;
//       res.status(200).json({success:true,others});
//     } catch (err) {
//       res.status(500).json({success:false,msg:"err"});
//     }
//   });

  
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
