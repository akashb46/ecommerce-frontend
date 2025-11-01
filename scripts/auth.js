// ===== Firebase imports =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ===== Firebase configuration =====
const firebaseConfig = {
  apiKey: "AIzaSyBcUDiB0gWP1NC-htGa7UXhzLMsb24AQzY",
  authDomain: "e-c0mmerce-18074.firebaseapp.com",
  projectId: "e-c0mmerce-18074",
  storageBucket: "e-c0mmerce-18074.firebasestorage.app",
  messagingSenderId: "721738222691",
  appId: "1:721738222691:web:6f2d580a610b3dd734fc56",
  measurementId: "G-LNF52WHGR4"
};

// ===== Initialize Firebase =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== LOGIN FORM HANDLER =====
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.replace("home.html");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("No user found with this email.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format.");
          break;
        default:
          alert(error.message);
      }
    }
  });
});
