 import React from 'react';
import './forgotpassword.css'; 
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className ="forgot-page">
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your registered email address. We'll send you a link to reset your password.</p>
       <div/>
      <form className="forgot-password-form">
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="forgot-input"
        />
        <button type="submit" className="reset-btn">Send Reset Link</button>
      </form>

      <p style={{ marginTop: '15px' }}>
        <Link className="link"to="/">Back to Login</Link>
      </p>
    </div>
    </div>
  );
}
