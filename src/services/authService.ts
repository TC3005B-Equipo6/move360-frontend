import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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


export async function validateToken() {
  const token = localStorage.getItem("token");

  console.log("Token enviado:", token);

  const response = await fetch("http://localhost:8080/auth/validate", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.text();
  console.log("Respuesta backend:", data);

  return data;
}
