// src/components/Footer.jsx
import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./footer.css";

const Footer = () => {
  const emailRef = useRef();

  useEffect(() => {
    AOS.init();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value.trim();

    if (!email || !email.includes("@")) {
      Toastify({
        text: "Please enter a valid email.",
        duration: 3000,
        gravity: "top",
        position: "left",
        style: {
          marginTop: "50px",
          background: "#B9B2A8",
          color: "#3b2f2f",
          fontFamily: "'Wix Madefor Display', serif"
        }
      }).showToast();
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/newsletter/subscribe", { email });
      const message = res.data.message || "";

      if (message.toLowerCase().includes("already subscribed")) {
        Toastify({
          text: "Already subscribed!",
          duration: 3000,
          gravity: "top",
          position: "left",
          style: {
            background: "#3b2f2f",
            color: "#B9B2A8",
            fontFamily: "'Wix Madefor Display', serif"
          }
        }).showToast();
      } else {
        Toastify({
          text: "Subscribed successfully!",
          duration: 3000,
          gravity: "top",
          position: "left",
          style: {
            background: "#3b2f2f",
            color: "#B9B2A8",
            fontFamily: "'Wix Madefor Display', serif"
          }
        }).showToast();
        emailRef.current.value = "";
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Subscription failed.";
      Toastify({
        text: errMsg,
        duration: 3000,
        gravity: "top",
        position: "left",
        style: {
          background: "#3b2f2f",
          color: "#B9B2A8",
          fontFamily: "'Wix Madefor Display', serif"
        }
      }).showToast();
    }
  };

  return (
    <footer className="footer" data-aos="fade-up">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand" data-aos="fade-up" data-aos-delay="100">
          <h3>Zenticle</h3>
          <p className="tagline">Your Source of <br />Knowledge</p>
        </div>

        {/* Links */}
        <div className="footer-links-grid" data-aos="fade-up" data-aos-delay="200">
          <div className="link-column">
            <h4>Explore</h4>
            <a href="/">Home</a>
            <a href="/community">Community</a>
            <a href="/write">Create your post</a>
          </div>
          <div className="link-column">
            <h4>About</h4>
            <a href="/about">Vision</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/accessibility">Accessibility Statement</a>
          </div>
          <div className="link-column">
            <p className="footer-address">
              📍 500 Terry Francine Street,<br />
              6th Floor, San Francisco, CA 94158<br />
              📧 info@zenticle.com<br />
              📞 123-456-7890
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter" data-aos="fade-up" data-aos-delay="300">
          <h4 className="news">Subscribe to our Newsletter</h4>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" placeholder="Enter your email" ref={emailRef} required />
            <button type="submit">Subscribe</button>
          </form>

          {/* Social Icons */}
          <div className="social-icons">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg" alt="X" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2035 by Zenticle. Powered and secured by <a href="#">Wix</a></p>
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ⬆
        </button>
      </div>
    </footer>
  );
};

export default Footer;
