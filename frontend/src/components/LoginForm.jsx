/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "./LoginForm.css";
import logo from "../images/home.jpg";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { BASE_URL } from "../config/const";
import Admin from "./Admin";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState();
  useEffect(() => {
    setIsAuth(localStorage.getItem("token"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const { data } = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });
      localStorage.setItem("token", JSON.stringify(data.token));
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log(data);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: "custom-toast",
        },
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Signed in successfully",
      });
      navigate("/");

      console.log("oke");
    } catch (error) {}
  };

  return (
    <>
      {isAuth ? (
        <Admin />
      ) : (
        <div className="login-container">
          <div className="login-box">
            <div className="login-left">
              <img src={logo} alt="Logo" className="login-logo" />
              <h2>Home smart</h2>
              <p>Please login to your account</p>
              <form onSubmit={handleSubmit} className="login-form">
                <input
                  type="text"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
                <input
                  type="password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <button type="submit">Log In</button>
              </form>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
              <p className="signup-text">
                Don't have an account?{" "}
                <Link to={"/sign-up"} className="create-account">
                  CREATE NEW
                </Link>
              </p>
            </div>
            <div className="login-right">
              <h2>Website điều khiển nhà thông minh</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginForm;
