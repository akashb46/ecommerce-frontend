// ===== Firebase imports =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
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

document.addEventListener('DOMContentLoaded', () => {

  // ===== AUTH STATE =====
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameElem = document.getElementById("userName");

 onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.href;

  if (user) {
    console.log("✅ User logged in:", user.email);
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userNameElem) userNameElem.textContent = `Hello, ${user.displayName || user.email}`;

    // If the user is logged in and currently on login/signup page → redirect to home/shop
    if (currentPage.includes("login.html") || currentPage.includes("signup.html")) {
      window.location.href = "home.html"; // ✅ Change this to your homepage
    }
  } else {
    console.log("⚠️ No user logged in yet");
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userNameElem) userNameElem.textContent = "";

    // Delay redirect slightly to allow Firebase to finish checking state
    setTimeout(() => {
      if (
        !currentPage.includes("login.html") &&
        !currentPage.includes("signup.html")
      ) {
        window.location.href = "login.html";
      }
    }, 1000); // wait 1 second before redirecting
  }
});


  // ===== LOGOUT =====
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.href = "login.html";
      } catch (error) {
        alert("Error logging out: " + error.message);
      }
    });
  }

  // ===== LOGIN FORM =====
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginToggle = document.querySelector('#loginForm .toggle-password');

    // Password toggle
    if (loginToggle) {
      loginToggle.addEventListener('click', () => {
        if (loginPasswordInput.type === 'password') {
          loginPasswordInput.type = 'text';
          loginToggle.textContent = '🙈';
        } else {
          loginPasswordInput.type = 'password';
          loginToggle.textContent = '👁️';
        }
      });
    }

    // Login submit
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = loginPasswordInput.value.trim();

      if (!email || !password) {
        alert("Please fill all fields!");
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        // Redirect to homepage or dashboard after login
        window.location.href = "home.html"; // change this page if needed
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            alert("No account found with this email.");
            break;
          case "auth/wrong-password":
            alert("Incorrect password. Try again.");
            break;
          default:
            alert(error.message);
        }
      }
    });
  }

  // ===== SIGNUP FORM =====
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const strengthMsg = document.getElementById('strengthMsg');
    const signupToggle = document.querySelector('#signupForm .toggle-password');

    // Password toggle
    if (signupToggle) {
      signupToggle.addEventListener('click', () => {
        if (signupPassword.type === 'password') {
          signupPassword.type = 'text';
          signupToggle.textContent = '🙈';
        } else {
          signupPassword.type = 'password';
          signupToggle.textContent = '👁️';
        }
      });
    }

    // Password strength indicator
    signupPassword.addEventListener('input', () => {
      const val = signupPassword.value;
      if (val.length < 8) {
        strengthMsg.textContent = 'Weak (min 8 chars)';
        strengthMsg.style.color = 'red';
      } else if (!/[A-Z]/.test(val) || !/[a-z]/.test(val) || !/[0-9]/.test(val)) {
        strengthMsg.textContent = 'Medium (include uppercase, lowercase & number)';
        strengthMsg.style.color = 'orange';
      } else {
        strengthMsg.textContent = 'Strong password';
        strengthMsg.style.color = 'green';
      }
    });

    // Signup submit
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = signupPassword.value.trim();
      const confirmPass = confirmPassword.value.trim();

      if (!name || !email || !password || !confirmPass) {
        alert("Please fill all fields!");
        return;
      }

      if (password !== confirmPass) {
        alert("Passwords do not match!");
        return;
      }

      if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        alert("Password must be at least 8 chars and include uppercase, lowercase & number");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        alert("Signup successful! Redirecting to login page...");
        signupForm.reset();
        
        // Delay ensures Firebase fully updates user before redirect
        setTimeout(() => {
          window.location.href = "login.html";
        }, 800);
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            alert("This email is already registered. Try logging in.");
            break;
          case "auth/invalid-email":
            alert("Invalid email format.");
            break;
          case "auth/weak-password":
            alert("Password is too weak. Use at least 8 chars, uppercase, lowercase & number.");
            break;
          default:
            alert(error.message);
        }
      }
    });
  }

});
