
import { initializeApp }

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

  getAuth,

  signInWithEmailAndPassword

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// Firebase Config

const firebaseConfig = {

  apiKey: "AIzaSyCSaVimM8z7Mibdlo8LhTdxPmU9To_9doo",

  authDomain: "atuma-bf23b.firebaseapp.com",

  projectId: "atuma-bf23b",

  storageBucket: "atuma-bf23b.firebasestorage.app",

  messagingSenderId: "688756803961",

  appId: "1:688756803961:web:7751cc7d3bfacd0a6087a8",

  measurementId: "G-DXW2ZLL65E"
};


// Initialize Firebase

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);


// Form

const form =
  document.getElementById("loginForm");


// Login

form.addEventListener(

  "submit",

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
        "Please enter email and password."
      );

      return;
    }

    try {

      // Login user

      await signInWithEmailAndPassword(

        auth,
        email,
        password

      );

      alert(
        "✅ Login successful!"
      );

      // Redirect

      window.location.href =
      "teacher.html";

    }

    catch (error) {

      alert(
        "❌ Login failed: "
        + error.message
      );
    }

  }

);
