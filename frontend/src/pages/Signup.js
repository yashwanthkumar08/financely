import React from "react";
import Header from "../components/header";
import SignupSigninComponent from "../components/Signupsignin";

const Signup = () => {
  return (
    <div>
      <Header showLogout={false} />
      <div className="wrapper">
        <SignupSigninComponent />
      </div>
    </div>
  );
};

export default Signup;
