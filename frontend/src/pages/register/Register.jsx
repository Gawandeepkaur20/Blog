import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { injectModels } from "../../Redux/injectModel";
import axios from "axios";
import { toast } from "react-toastify";
import { Facebook, Twitter, CircleUserRound } from "lucide-react";

const Register = (props) => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profilePicPath, setProfilePicPath] = useState("");

  const [errorFname, setErrorFname] = useState("");
  const [errorLname, setErrorLname] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await axios.post("http://localhost:5000/upload/profile", formData);
        const filename = res.data.filePath.split("/").pop();
        setProfilePicPath(filename);
      } catch (err) {
        toast.error("Image upload failed. Try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!fname) {
      setErrorFname("First name is required.");
      valid = false;
    }

    if (!lname) {
      setErrorLname("Last name is required.");
      valid = false;
    }

    if (!email || !emailRegex.test(email)) {
      setErrorEmail("Please enter a valid email.");
      valid = false;
    }

    if (!password || !passwordRegex.test(password)) {
      setErrorPassword("Password must meet complexity requirements.");
      valid = false;
    }

    if (!profilePicPath) {
     toast.warning(" Please upload a profile picture!", {
  position: "top-left",
  autoClose: 3000,
  style: {
    marginTop: "50px",
    backgroundColor: "#B9B2A8", // match theme
    color:  "#3b2f2f",              // white text
    fontFamily: "'Wix Madefor Display', serif"
  }
});
      valid = false;
    }

    if (!valid) return;

    try {
      const payload = {
        username: `${fname} ${lname}`,
        email,
        password,
        profilePic: profilePicPath,
      };

      const res = await props.auth.register(payload);

      if (res.success) {
        toast.success(" Registered successfully! Redirecting...", {
  position: "top-left",
  autoClose: 3000,
  style: {
    marginTop: "50px",
    backgroundColor: "#B9B2A8", // match theme
    color:  "#3b2f2f",              // white text
    fontFamily: "'Wix Madefor Display', serif"
  }
});
        setTimeout(() => navigate("/login"), 2000);
      } else {
       
         toast.error(res.message || "Registration failed", {
        position: "top-right",
        autoClose: 3000,
        style: {
    marginTop: "50px",
    backgroundColor: "#B9B2A8", // match theme
    color:  "#3b2f2f",              // white text
    fontFamily: "'Wix Madefor Display', serif"
  }
      });
      }
    } catch (error) {
      
        
         toast.error(" Something went wrong. Try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

    }
  };

  return (
    <div className="register-page">
      <div className="left-section">
        <h1 className="zenticle-title">Zenticle</h1>
        <img src="/girl-removebg-preview.png" alt="Zenticle Girl" className="girl-image" />
        <div className="text-below-img">
          <h2>Where Calm Meets Curiosity</h2>
          <p>Discover and share ideas that truly resonate.</p>
        </div>
      </div>

      <div className="right-section">
        <h2>Register</h2>
        <p>Enter your details to get started</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <input type="text" placeholder="First Name" onChange={(e) => { setFname(e.target.value); setErrorFname(""); }} />
          {errorFname && <p className="error">{errorFname}</p>}

          <input type="text" placeholder="Last Name" onChange={(e) => { setLname(e.target.value); setErrorLname(""); }} />
          {errorLname && <p className="error">{errorLname}</p>}

          <input type="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value); setErrorEmail(""); }} />
          {errorEmail && <p className="error">{errorEmail}</p>}

          <input type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value); setErrorPassword(""); }} />
          {errorPassword && <p className="error">{errorPassword}</p>}

  
          <input type="file" id="profilePicInput" accept="image/*" onChange={handleFileChange} hidden />
          {preview && <img src={preview} alt="Profile Preview" className="preview-img" />}
       <label htmlFor="profilePicInput" className="upload-btn">
    📸 Choose Profile Picture
  </label>
          <label className="terms">
            <input type="checkbox" required /> I agree to the{" "}
            <a className="link-term" href="#">terms and conditions</a>
          </label>

          <button className="signup-btn" type="submit">Sign up</button>

          <p className="signin-link">
            Already have an account? <Link className="link-signin" to="/login">Sign in</Link>
          </p>

      <div className="socialicons">
  <a href="https://accounts.google.com/signup" target="_blank" rel="noreferrer">
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
      alt="Google"
      className="socialsvg google"
      title="Sign up with Google"
    />
  </a>
  <a href="https://facebook.com" target="_blank" rel="noreferrer">
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
      alt="Facebook"
      className="socialsvg facebook"
      title="Sign up with Facebook"
    />
  </a>
  <a href="https://twitter.com/i/flow/signup" target="_blank" rel="noreferrer">
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg"
      alt="Twitter"
      className="socialsvg twitter"
      title="Sign up with Twitter"
    />
  </a>
</div>

        </form>
      </div>
    </div>
  );
};

export default injectModels(["auth"])(Register);
