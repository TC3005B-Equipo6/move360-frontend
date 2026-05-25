import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./auth";
import api from "../api";
import adminApi from "../AdminApi";

export const login = async (email: string, password: string) => {
const userCredential = await signInWithEmailAndPassword(
auth,
email,
password
);
const user = userCredential.user;
const token = await user.getIdToken();
return token;
};


export const validateToken = async () => {
  const response = await api.get("/auth");
  return response.data;
};

export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("token");
};



/*export const requestPasswordRecovery = async (email: string) => {
  const response = await adminApi.post("/tickets/password-recovery", {
    email,
  });

  return response.data;
};*/


export const requestPasswordRecovery = async (email: string) => {
  const response = await adminApi.post(
    "/tickets/password-recovery",
    {
      email,
    }
  );

  return response.data;
};


