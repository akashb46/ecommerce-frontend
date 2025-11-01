// ===== Firebase imports =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
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
export const auth = getAuth(app);

// ===== Page Guard =====
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split("/").pop();

  if (user) {
    if (currentPage === "index.html" || currentPage === "" || currentPage === "login.html") {
      window.location.replace("home.html");
    }
  } else {
    if (currentPage === "home.html") {
      window.location.replace("login.html");
    }
  }
});
