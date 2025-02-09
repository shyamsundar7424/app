import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCUYMVCowL1t0R0vlZRtgauPlC9JpP70SE",
    authDomain: "blogging-app-4c3ec.firebaseapp.com",
    projectId: "blogging-app-4c3ec",
    storageBucket: "blogging-app-4c3ec.firebasestorage.app",
    messagingSenderId: "131793943046",
    appId: "1:131793943046:web:7250594206efdf93bca187"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const authWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user); // Debugging
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    return null;
  }
};

export { auth, provider };
