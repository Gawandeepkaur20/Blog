import "./login.css";
import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { injectModels } from "../../Redux/injectModel";

const Login = (props) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const emaillogin = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordlogin = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleEmail = () => {
  const val = email.trim();
  if (!val) {
    setErrorEmail("Email is required.");
    triggerAlert("Email is required.");
  } else if (!emaillogin.test(val)) {
    setErrorEmail("Invalid email format.");
    triggerAlert("Invalid email format.");
  } else {
    setErrorEmail("");
  }
};

  const handlePassword = () => {
  const val = password.trim();
  if (!val) {
    setErrorPassword("Password is required.");
    triggerAlert("Password is required.");
  } else if (!passwordlogin.test(val)) {
    setErrorPassword(
      "Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
    );
    triggerAlert("Password format is invalid.");
  } else {
    setErrorPassword("");
  }
};
  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    let valid = true;

    if (!trimmedEmail || !emaillogin.test(trimmedEmail)) {
      setErrorEmail("Please enter a valid email.");
      triggerAlert("Please enter a valid email.");
      valid = false;
    }

    if (!trimmedPassword || !passwordlogin.test(trimmedPassword)) {
      setErrorPassword(
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
      );
      triggerAlert("Password format is incorrect.");
      valid = false;
    }
  if (!valid) {
    setAlertMessage("Enter valid email and password!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
    return;
  }
    if (valid) {
      try {
        const response = await props.auth.login({ email: trimmedEmail, password: trimmedPassword });
        if (response?.success) {
          navigate("/");
        } else {
          triggerAlert("Invalid email or password.");
        }
      } catch (error) {
        triggerAlert("Something went wrong. Try again.");
        console.error("Login error:", error);
      }
    }
  };
  return (
    <div className="login">
      <header className="login-header">
        <div className="container">
          <LoginHeader />
          <form onSubmit={handleSubmit} noValidate>
            <div className="container-email">
              <input
                type="email"
                placeholder="Enter your email"
               onChange={(e) => setEmail(e.target.value.trim())}
  onBlur={handleEmail}  // <- only trigger validation when user leaves the field
  value={email}
  required
  autoFocus
              />
            </div>
            {errorEmail && <p className="error">{errorEmail}</p>}

            <div className="container-password">
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value.trim())}
  onBlur={handlePassword}  // <- only trigger validation when user leaves the field
  value={password}
  required
              />
            </div>
            {errorPassword && <p className="error">{errorPassword}</p>}

            <div
              className="container-remember"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <div className="forgot-password">
                <Link className='link-pass' to="/forgot-password">Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          
        </div>
      </header>
       {showAlert && (
      <div className="custom-alert">
        ⚠️ {alertMessage}
      </div>
    )}
    </div>
    
  );
};

function LoginHeader() {
  return (
    <center>
      <div className="Button-div">
        <h1 style={{ marginBottom: "5px", fontSize: "30px" }}>Welcome</h1>
        <h5 style={{ marginTop: "0", fontSize: "16px" }}>
          Don't have an account? <Link className="link-sign"to="/register">Sign Up</Link>
        </h5>
      </div>
      
    </center>
    
  );
}

export default injectModels(["auth"])(Login);
