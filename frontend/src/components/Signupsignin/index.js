import React, { useState } from "react";
import "./styles.css";
import Input from "../input";
import Button from "../Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignupSigninButton from "../SignupLoginButton";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  console.log(name, email, password);

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Function to handle sign up
  // Function to handle sign up
  async function handleSignup() {
    console.log("Signup function called"); // Check if this logs when the form is submitted

    // Validate inputs
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.error("All fields are mandatory");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Send signup data to backend API
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup successful! Please log in.");
        setLoginForm(true); // Switch to login form after successful signup
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Error during signup:", error);
    }
  }

  // Function to handle login
  async function handleLogin() {
    // Perform login logic
    if (email === "" || password === "") {
      toast.error("All fields are mandatory");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        localStorage.setItem("userEmail", email);
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.log("Error during login:", error);
    }
  }

  console.log("loginForm - ", loginForm);
  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            {" "}
            Log In <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johndoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example123"}
            />
            <SignupSigninButton
              text={"Login using Email and Password"}
              type="submit"
            />
            <p
              className="p-login"
              onClick={() => {
                setLoginForm(!loginForm);
              }}
            >
              Don't have an account? Click here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign up on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"John Doe"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johndoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example123"}
            />
            <SignupSigninButton
              text={"Signup using Email and Password"}
              type="submit" // Keep the button type as submit
            />
            <p
              className="p-login"
              onClick={() => {
                setLoginForm(!loginForm);
              }}
            >
              Already have an account? Click here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
