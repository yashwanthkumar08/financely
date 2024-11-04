import React from "react";
import "./styles.css";

function Button({ text, onClick }) { // Removed the blue prop
  return (
    <button
      className="btn" // Apply the btn class here
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
}

export default Button;
