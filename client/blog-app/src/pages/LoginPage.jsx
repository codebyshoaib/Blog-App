import React, { useContext, useState } from "react";
import "../App.css";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function handleLogin(e) {
    e.preventDefault();

    const result = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/login`, {
      method: "POST",
      body: JSON.stringify({
        userName: userName,
        password: password,
      }),
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
    });

    if (result.ok) {
      result.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("Wrong Credentials");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login">
      <div className="container mt-5">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={userName}
              onChange={(ev) => setUserName(ev.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary bg-success">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
