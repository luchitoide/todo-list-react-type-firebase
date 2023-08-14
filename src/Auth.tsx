import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./components/firebaseConfig";
import { setAuthentication } from "./features/taskSlice";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'


const Auth: React.FC = () => {
    const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Estado para el correo del usuario

  const handleAuth = async () => {
    try {
      setErrorMessage(null);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      dispatch(setAuthentication(true));
      setUserEmail(email); // Almacenar el correo del usuario en el estado
    } catch (error: any) {
      console.error("Authentication error:", error);
      if (error.code === "auth/user-not-found") {
        setErrorMessage("User not found.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Wrong password.");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email already in use.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const handleLogOut = () => {
    // Restablecer el estado de autenticación a false
    dispatch(setAuthentication(false));
    setUserEmail(null)
  };
  

  return (
    <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-8 w-full lg:w-1/3">
        {userEmail ? ( // Si hay un correo de usuario, mostrar solo el correo
          <div>
            <p className="text-grey-darkest text-3xl mb-4">
              Welcome, {userEmail}!
            </p>
            <button
              onClick={handleLogOut} // Cerrar sesión
              className="w-full p-2 rounded bg-teal-500 text-white hover:bg-teal-600"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-grey-darkest text-3xl mb-4">
              {isLogin ? "Log In" : "Sign Up"}
            </h1>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-grey-darker"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-grey-darker"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleAuth}
              className="w-full p-2 rounded bg-teal-500 text-white hover:bg-teal-600"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
            <p className="text-center mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span
                className="cursor-pointer text-teal-500 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up here" : "Log in here"}
              </span>
            </p>
            {errorMessage && (
              <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
