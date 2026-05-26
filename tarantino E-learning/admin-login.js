import { initializeApp }

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

  getAuth,

  signInWithEmailAndPassword

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// Firebase Config

const firebaseConfig = {
  apiKey: "AIzaSyDv0wNHZl4wSXd10B7tr9Br-7phWidLDaU",
  authDomain: "tarantino-e-learning.firebaseapp.com",
  projectId: "tarantino-e-learning",
  storageBucket: "tarantino-e-learning.firebasestorage.app",
  messagingSenderId: "501202693775",
  appId: "1:501202693775:web:fabc3af9989542c9a18afa",
  databaseURL: "https://tarantino-e-learning-default-rtdb.firebaseio.com"
};


// Initialize Firebase

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);


// Login Form

const form =
  document.getElementById(
    "loginForm"
  );


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

    try {

      await signInWithEmailAndPassword(

        auth,
        email,
        password

      );

      alert(
        "✅ Login successful"
      );

      // Redirect once only

      window.location.href =
      "/tarantino/tarantino E-learning/admin-dashboard.html";

    }

    catch(error){

      console.error(error);

      alert(
        "❌ "
        + error.message
      );
    }

  }

);
