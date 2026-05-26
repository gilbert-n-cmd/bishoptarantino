import { initializeApp }

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

  getAuth,

  onAuthStateChanged,

  signOut,

  createUserWithEmailAndPassword

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

  getFirestore,

  collection,

  getDocs,

  addDoc,

  doc,

  deleteDoc

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// Firebase Config

const firebaseConfig = {

  apiKey:
  "AIzaSyDv0wNHZl4wSXd10B7tr9Br-7phWidLDaU",

  authDomain:
  "tarantino-e-learning.firebaseapp.com",

  projectId:
  "tarantino-e-learning",

  storageBucket:
  "tarantino-e-learning.firebasestorage.app",

  messagingSenderId:
  "501202693775",

  appId:
  "1:501202693775:web:fabc3af9989542c9a18afa"

};


// Initialize Firebase

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


// Prevent repeated loading

let dataLoaded = false;


// Authentication State

onAuthStateChanged(

  auth,

  async (user) => {

    // User not logged in

    if (!user) {

      window.location.href =
      "/tarantino/tarantino E-learning/index.html";

      return;
    }

    // Stop repeated refreshing

    if (dataLoaded) return;

    dataLoaded = true;

    // Load dashboard data once

    await loadAllData();

  }

);


// Logout

document

.getElementById("logoutBtn")

.addEventListener(

  "click",

  async () => {

    try {

      await signOut(auth);

      window.location.href =
      "/tarantino/tarantino E-learning/index.html";

    }

    catch(error){

      console.error(error);

      alert(
        "Logout failed"
      );
    }

  }

);
