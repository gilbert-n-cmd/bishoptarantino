import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// Firebase Config

const firebaseConfig = {

  apiKey: "AIzaSyB7YKrlfRvSFhwiPfWgecXITw4s36W0kFY",

  authDomain: "trial-48df4.firebaseapp.com",

  projectId: "trial-48df4",

  storageBucket: "trial-48df4.firebasestorage.app",

  messagingSenderId: "732403893639",

  appId: "1:732403893639:web:93b6ca1fbabdc135f47f22"
};


// Initialize Firebase

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);


// Elements

const loginBtn =
  document.getElementById("loginBtn");

const signupLink =
  document.getElementById("signupLink");


// ======================
// Login
// ======================

loginBtn.addEventListener(

  "click",

  async () => {

    const email =

      document.getElementById("email")
      .value
      .trim();

    const password =

      document.getElementById("password")
      .value
      .trim();

    if (!email || !password) {

      alert(
        "Please enter email and password."
      );

      return;
    }

    try {

      await signInWithEmailAndPassword(

        auth,
        email,
        password

      );

      alert(
        "✅ Login successful!"
      );

      window.location.href =
        "student-dashboard.html";

    }

    catch (error) {

      alert(
        "❌ " + error.message
      );
    }

  }

);


// ======================
// Sign Up
// ======================

signupLink.addEventListener(

  "click",

  async (e) => {

    e.preventDefault();

    const email =

      document.getElementById("email")
      .value
      .trim();

    const password =

      document.getElementById("password")
      .value
      .trim();

    if (!email || !password) {

      alert(
        "Enter email and password first."
      );

      return;
    }

    if (password.length < 6) {

      alert(
        "Password must be at least 6 characters."
      );

      return;
    }

    try {

      // Create Account

      await createUserWithEmailAndPassword(

        auth,
        email,
        password

      );

      alert(
        "✅ Account created successfully!"
      );

    }

    catch (error) {

      alert(
        "❌ " + error.message
      );
    }

  }

);