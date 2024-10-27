import React from "react";
import "./styles.css";

function SignupSigninButton({ text, blue }) {
  return <button className={blue ? "btn btn-blue" : "btn"}>{text}</button>;
}

export default SignupSigninButton;
