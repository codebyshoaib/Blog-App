import React, { useState } from "react";
import "../App.css";
export const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [userName,setUserName]=useState("");
  async function register(ev) {
    ev.preventDefault();
   const result= await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/register`, {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        userName:userName,
        password: password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if(result.status!=200){
      alert('Regsitration Failed');
    }
    else{
      alert(`Registration Success: ${firstName}`);
    }
    
   
  }

  return (
    <div className="register">
      <div className="container mt-5">
        <h2 className="text-center mb-4">Register </h2>
        <form onSubmit={register}>
          <div className="mb-3">
            <label htmlFor="firstname" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstname"
              name="firstname"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(ev) => setFirstName(ev.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastname" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastname"
              name="lastname"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(ev) => setLastName(ev.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              User Name
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Enter username for the App"
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
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
