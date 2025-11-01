// ===== Firebase imports =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
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

// ===== Handle Authentication State =====
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  console.log("Auth:", user ? "Logged In ✅" : "Logged Out ❌", "| Page:", currentPage);

  // Prevent rapid redirect flicker
  if (window._redirecting) return;
  window._redirecting = true;

  setTimeout(() => {
    if (user) {
      // If logged in, redirect to home unless already there
      if (currentPage === "index.html" || currentPage === "login.html" || currentPage === "") {
        window.location.replace("home.html");
      }
    } else {
      // If not logged in, restrict home page
      if (currentPage === "home.html") {
        window.location.replace("login.html");
      }
    }
    window._redirecting = false;
  }, 300);
});

// ===== Logout Handler =====
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.replace("login.html");
      } catch (error) {
        alert("Error logging out: " + error.message);
      }
    });
  }
});
