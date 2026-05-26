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

export interface UserProfile {
  firstName: string;
  surname: string;
  maternalSurname?: string;
  role: string;
  email: string;
}

type UserProfileResponse = {
  firstName?: string | null;
  name?: string | null;
  surname?: string | null;
  paternalSurname?: string | null;
  lastName?: string | null;
  maternalSurname?: string | null;
  role?: string | { name?: string | null } | null;
  email?: string | null;
};

const textOrEmpty = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const normalizeRole = (role: UserProfileResponse["role"]): string => {
  if (typeof role === "string") return role.trim();
  return textOrEmpty(role?.name);
};

const normalizeProfile = (data: UserProfileResponse): UserProfile => ({
  firstName: textOrEmpty(data.firstName) || textOrEmpty(data.name),
  surname:
    textOrEmpty(data.surname) ||
    textOrEmpty(data.paternalSurname) ||
    textOrEmpty(data.lastName),
  maternalSurname: textOrEmpty(data.maternalSurname) || undefined,
  role: normalizeRole(data.role),
  email: textOrEmpty(data.email),
});

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfileResponse>("/auth/profile");
  return normalizeProfile(response.data);
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


