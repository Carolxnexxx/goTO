import React, { createContext, useState } from 'react';

export const LitterContext = createContext();

export const LitterProvider = ({ children }) => {
  const [totalLitter, setTotalLitter] = useState(0);

  return (
    <LitterContext.Provider value={{ totalLitter, setTotalLitter }}>
      {children}
    </LitterContext.Provider>
  );
};