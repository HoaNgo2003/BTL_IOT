/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./SignupForm.css";
import logo from "../images/home.jpg";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/const";
function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    const { data } = await axios.post(`${BASE_URL}/users/signup`, {
      username,
      password,
      email,
    });
    console.log(data);
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-left">
          <img src={logo} alt="Logo" className="signup-logo" />
          <h2>Home smart</h2>
          <p>Please create your account</p>
          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Sign Up</button>
          </form>
          <p className="login-text">
            Already have an account?{" "}
            <Link to={"/login"} className="login-account">
              LOG IN
            </Link>
          </p>
        </div>
        <div className="signup-right">
          <h2>Website điều khiển nhà thông minh</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
