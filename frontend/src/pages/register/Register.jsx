import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { injectModels } from "../../Redux/injectModel";
import axios from "axios";

const Register = (props) => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profilePic, setProfilePic] = useState("");

  const [errorFname, setErrorFname] = useState("");
  const [errorLname, setErrorLname] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const[profilePicPath,setProfilePicPath]=useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 3500);
  };

  const handleFileChange = async (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);

  if (selectedFile) {
    setPreview(URL.createObjectURL(selectedFile));

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://localhost:5000/upload/profile", formData);
      
      // Extract just the filename
      const filename = res.data.filePath.split("/").pop();
      setProfilePicPath(filename);
       return res.data.filename;
    } catch (err) {
      console.error("Upload failed", err);
      triggerAlert("Image upload failed. Try again.");
    }
  }
};


  const handleFname = (e) => {
    const val = e.target.value.trim();
    setFname(val);
    setErrorFname(val ? "" : "First name is required.");
  };

  const handleLname = (e) => {
    const val = e.target.value.trim();
    setLname(val);
    setErrorLname(val ? "" : "Last name is required.");
  };

  const handleEmail = (e) => {
    const val = e.target.value.trim();
    setEmail(val);
    if (!val) setErrorEmail("Email is required.");
    else if (!emailRegex.test(val)) setErrorEmail("Invalid email format.");
    else setErrorEmail("");
  };

  const handlePassword = (e) => {
    const val = e.target.value.trim();
    setPassword(val);
    if (!val) setErrorPassword("Password is required.");
    else if (!passwordRegex.test(val)) {
      setErrorPassword("Password must meet complexity requirements.");
    } else setErrorPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

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

    if (valid) {
      try {
        const payload = {
          username: `${fname} ${lname}`,
          email,
          password,
          profilePic:profilePicPath,
        };

        const res = await props.auth.register(payload);

        if (res.success) {
          triggerAlert("Registration successful!");
          navigate("/");
        } else {
          triggerAlert(res.message || "Registration failed.");
        }
      } catch (error) {
        console.error("Register error:", error);
        triggerAlert("Something went wrong. Try again.");
      }
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
          <input type="text" placeholder="First Name" onChange={handleFname} />
          {errorFname && <p className="error">{errorFname}</p>}

          <input type="text" placeholder="Last Name" onChange={handleLname} />
          {errorLname && <p className="error">{errorLname}</p>}

          <input type="email" placeholder="Email" onChange={handleEmail} />
          {errorEmail && <p className="error">{errorEmail}</p>}

          <input type="password" placeholder="Password" onChange={handlePassword} />
          {errorPassword && <p className="error">{errorPassword}</p>}

          <label htmlFor="profilePicInput">Upload Profile Picture</label>
<input
  type="file"
  id="profilePicInput"
  accept="image/*"
  onChange={handleFileChange}
/>

{preview && (
  <img src={preview} alt="Profile Preview" className="preview-img" />
)}

          <label className="terms">
            <input type="checkbox" required /> I agree to the {" "}
            <a className="link-term" href="#">terms and conditions</a>
          </label>

          <button className="signup-btn" type="submit">Sign up</button>

          <p className="signin-link">
            Already have an account? <Link className="link-signin" to="/login">Sign in</Link>
          </p>

          <div className="social-buttons">
            <button type="button" className="google">Google</button>
            <button type="button" className="facebook">Facebook</button>
            <button type="button" className="twitter">Twitter</button>
          </div>
        </form>
      </div>
      {showAlert && (
        <div className="custom-alert">
          ⚠️ {alertMessage}
        </div>
      )}
    </div>
  );
};

export default injectModels(["auth"])(Register);
