import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export const Header = () => {
 const {setUserInfo,userInfo}=useContext(UserContext);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
       setUserInfo(userInfo)
      });
    });
  }, []);

  function handleLogOut(){
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/logout`,{
      credentials:'include',
      method:'POST'

    })
    setUserInfo(null);
  }
  const userName=userInfo?.userName
 
  return (
    <>
     
      <header>
        <Link to="/" className="logo">
          My Blog
        </Link>
        <nav>
          {userName && (
            <>
              <Link to="/create">Create new post</Link>
              <a onClick={()=>handleLogOut()}>Logout</a>
            </>
          )}
          {!userName && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
};
