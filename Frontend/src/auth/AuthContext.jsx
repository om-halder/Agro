import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";



const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ RUN ONCE ONLY
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Firebase user:", user);
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ✅ POPUP ONLY (not redirect)
  const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider);

  const logout = () => signOut(auth);

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{ currentUser, register, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
