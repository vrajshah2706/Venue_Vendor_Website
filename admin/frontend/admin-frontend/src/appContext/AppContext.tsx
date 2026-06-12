import { createContext, useContext, useState, useEffect } from "react";
const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: any) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  // restore session on refresh
  useEffect(() => {
    const stored = localStorage.getItem("isAdmin");
    setIsSignedIn(stored === "true");
  }, []);

  const signIn = () => {
    localStorage.setItem("isAdmin", "true");    //adds it to local storage 
    setIsSignedIn(true); // updates header  
  };

  const signOut = () => {
    localStorage.removeItem("isAdmin"); //removes from localstorage 
    setIsSignedIn(false);   //updates header 
  };

  return (
    <AppContext.Provider value={{ isSignedIn, signIn, signOut }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);