// auth.js (replace your current file with this)

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
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameElem = document.getElementById("userName");

  // pages treated as public (no login required)
  const publicPages = ["index.html", "login.html", "signup.html", ""];

  // Helper: get current filename (dynamic, so checks latest on each auth change)
  const getCurrentPage = () => window.location.pathname.split("/").pop();

  // If signup flow sets this flag, onAuthStateChanged will ignore auto-redirects
  // This prevents the createUser -> auto-signed-in -> redirect race.
  const SIGNUP_FLAG = 'signupInProgress';

  // ===== AUTH STATE =====
  onAuthStateChanged(auth, (user) => {
    const currentPage = getCurrentPage();

    // If we're in the middle of signup, ignore redirect logic (prevents loop)
    if (sessionStorage.getItem(SIGNUP_FLAG)) {
      // don't redirect during signup; let signup code handle navigation
      return;
    }

    if (user) {
      // logged in -> show logout and name
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      if (userNameElem) userNameElem.textContent = `Hello, ${user.displayName || user.email}`;

      // send user to home if they're on a public page (except we allow staying on signup/login pages
      // for specific UX reasons). Here we redirect only when on login or index, but not signup.
      if (["index.html", "login.html", ""].includes(currentPage)) {
        window.location.href = "home.html";
      }

    } else {
      // not logged in -> hide logout, clear name
      if (logoutBtn) logoutBtn.style.display = "none";
      if (userNameElem) userNameElem.textContent = "";

      // If user is on a protected page, redirect to login
      if (!publicPages.includes(currentPage)) {
        window.location.href = "login.html";
      }
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

    if (loginToggle) {
      loginToggle.addEventListener('click', () => {
        loginPasswordInput.type = loginPasswordInput.type === 'password' ? 'text' : 'password';
        loginToggle.textContent = loginPasswordInput.type === 'password' ? '👁️' : '🙈';
      });
    }

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
        window.location.href = "home.html";
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

    if (signupToggle) {
      signupToggle.addEventListener('click', () => {
        signupPassword.type = signupPassword.type === 'password' ? 'text' : 'password';
        signupToggle.textContent = signupPassword.type === 'password' ? '👁️' : '🙈';
      });
    }

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
        // Mark that signup is in progress so onAuthStateChanged will not auto-redirect
        sessionStorage.setItem(SIGNUP_FLAG, '1');

        // create user (this signs the user in automatically)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // update display name
        await updateProfile(userCredential.user, { displayName: name });

        // Clear form and flag
        signupForm.reset();

        // ===== OPTION A (RECOMMENDED) =====
        // Keep user signed in and send them to home immediately.
        // This avoids sign-out / sign-in race loops.
        sessionStorage.removeItem(SIGNUP_FLAG);
        alert("Signup successful! Redirecting to home...");
        window.location.href = "home.html";
        return;

        // ===== OPTION B (IF YOU REALLY WANT TO FORCE LOGIN PAGE) =====
        // If you insist on sending new users to the login page, uncomment the block below.
        // IMPORTANT: this block signs the user out and navigates to login.html. Because we set
        // sessionStorage flag above, onAuthStateChanged won't auto-redirect while the flow runs.
        //
        // await signOut(auth);
        // sessionStorage.removeItem(SIGNUP_FLAG);
        // alert("Signup complete. Please login with your new credentials.");
        // window.location.href = "login.html";

      } catch (error) {
        // remove the flag if signup failed
        sessionStorage.removeItem(SIGNUP_FLAG);

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
