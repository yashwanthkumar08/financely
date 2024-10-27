import React from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Header({ showLogout }) {
  const Navigate = useNavigate();
  function logoutFnc() {
    Navigate("/");
    toast.success("logged out successfully");
  }
  return (
    <div className="navbar">
      <p className="logo">Financely</p>
      {showLogout && (
        <p className="logo link" onClick={logoutFnc}>
          Logout
        </p>
      )}
    </div>
  );
}

export default Header;
