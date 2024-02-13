import React from "react";
import "./myStyle.css";
import { useNavigate } from "react-router-dom";
import chatnow from "./Images/chatnow.png";
export default function Welcome() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    alert("token not found");
    navigate("/");
    return;
  }

  return (
    <div className="welcome-container">
      <div className="image-container" style={{ display: "block" }}>
        <img className="entry-logo" src={chatnow} alt="alt" />
      </div>
    </div>
  );
}
