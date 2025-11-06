// ===== Firebase imports =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ===== Firebase configuration (same as auth.js) =====
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

// ===== Protect private pages =====
document.addEventListener("DOMContentLoaded", () => {
  // Allow this script only on protected pages like home.html, cart.html, etc.
  onAuthStateChanged(auth, (user) => {
    // If no user, redirect once to login (not index)
    if (!user) {
      if (!window.location.pathname.endsWith("login.html")) {
        window.location.replace("login.html");
      }
    }
    // If user exists, do nothing (no redirect)
  });
});
