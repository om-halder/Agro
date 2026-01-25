import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../auth/firebase";

export const firebaseRegister = async (email, password) => {
  const userCred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCred.user;
};

export const firebaseLogin = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCred.user;
};
