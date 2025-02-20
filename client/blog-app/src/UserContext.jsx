import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({ userName: "" });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/profile`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((userData) => {
            setUserInfo(userData); // Assuming the server returns the entire user object
          });
        }
      })
      .catch((error) => console.error("Error fetching user profile:", error));
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
