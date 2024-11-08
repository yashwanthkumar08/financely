import React from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoutIcon from "../../assets/logout.png";
import { Tooltip } from "antd";

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
        // <p className="logo link" onClick={logoutFnc}>
        //   Logout
        // </p>
        
        <Tooltip title="Logout">
          <img
            src={logoutIcon}
            alt="Logout"
            className="logout-logo"
            onClick={logoutFnc}
          />
        </Tooltip>
      )}
    </div>
  );
}

export default Header;
