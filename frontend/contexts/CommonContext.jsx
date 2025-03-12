import { createContext, useContext, useEffect, useState } from 'react';

const CommonContext = createContext();

export const useCommon = () => useContext(CommonContext);

export const Common = ({ children }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <CommonContext.Provider
      value={{
        userMenuOpen,
        setUserMenuOpen,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
