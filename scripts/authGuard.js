import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBcUDiB0gWP1NC-htGa7UXhzLMsb24AQzY",
  authDomain: "e-c0mmerce-18074.firebaseapp.com",
  projectId: "e-c0mmerce-18074",
  storageBucket: "e-c0mmerce-18074.firebasestorage.app",
  messagingSenderId: "721738222691",
  appId: "1:721738222691:web:6f2d580a610b3dd734fc56",
  measurementId: "G-LNF52WHGR4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const currentPage = window.location.pathname.split("/").pop() || "index.html";

onAuthStateChanged(auth, (user) => {
  console.log("Guard:", currentPage, user ? "Logged in" : "Logged out");

  // Only protect certain pages
  if (user) {
    // Redirect logged in user away from index or login
    if (currentPage === "index.html" || currentPage === "login.html" || currentPage === "") {
      window.location.replace("home.html");
    }
  } else {
    // Redirect unauthenticated user away from home
    if (currentPage === "home.html") {
      window.location.replace("login.html");
    }
  }
});
