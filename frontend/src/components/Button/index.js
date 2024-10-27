import React from "react";
import "./styles.css";

function Button({ text, onClick, blue }) {
  return (
    <button
      className={blue ? "btn btn-blue" : "btn"}
      onClick={onClick}
      type="button" // Set type to button if you want to handle it with onClick
    >
      {text}
    </button>
  );
}

export default Button;
