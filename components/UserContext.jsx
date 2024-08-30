import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [sendUsername, setUserContext] = useState(0);

  return (
    <UserContext.Provider value={{ sendUsername, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};