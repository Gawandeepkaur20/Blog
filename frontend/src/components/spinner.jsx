import React from "react";
import "./spinner.css";

const Spinner = () => {
  return (
    
    <div  className="spinner-overlay">
      
      <div className="spinner"></div>
      <div className="spinner-text">Loading...</div>
    </div>
  );
};

export default Spinner;


