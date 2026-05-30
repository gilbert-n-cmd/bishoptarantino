
import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  getAuth,
  signOut,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// Firebase Config
const firebaseConfig = {

  apiKey: "AIzaSyDv0wNHZl4wSXd10B7tr9Br-7phWidLDaU",

  authDomain: "tarantino-e-learning.firebaseapp.com",

  projectId: "tarantino-e-learning",

  storageBucket: "tarantino-e-learning.firebasestorage.app",

  messagingSenderId: "501202693775",

  appId: "1:501202693775:web:fabc3af9989542c9a18afa"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


// Elements
const quizList =
  document.getElementById("quizList");

const notesList =
  document.getElementById("notesList");

const logoutBtn =
  document.getElementById("logoutBtn");

const filterSelect =
  document.getElementById("statusFilter");

const searchInput =
  document.getElementById("searchInput");

const searchNotes =
  document.getElementById("searchNotes");

const studentNameDiv =
  document.getElementById("studentName");


let allQuizzes = [];

let allNotes = [];


// ======================
// Authentication
// ======================

onAuthStateChanged(auth, (user) => {

  if (!user) {

    window.location.href =
      "student-login.html";

  } else {

    studentNameDiv.textContent =
      `Logged in as: ${user.email}`;

    loadQuizzes();

    loadNotes();

    // Auto refresh quizzes every 30 seconds
    setInterval(loadQuizzes, 30000);
  }
});


// ======================
// Load Quizzes
// ======================

async function loadQuizzes() {

  try {

    const snapshot =
      await getDocs(
        collection(db, "teacher_quizzes")
      );

    const now = new Date();

    allQuizzes = snapshot.docs.map(docSnap => {

      const q = docSnap.data();

      const start =
        q.open
        ? new Date(q.open)
        : new Date();

      const end =
        q.close
        ? new Date(q.close)
        : new Date();

      const status =
        now < start
        ? "upcoming"
        : now > end
        ? "expired"
        : "active-quiz";

      return {
        id: docSnap.id,
        ...q,
        start,
        end,
        status
      };
    });

    renderQuizzes();

  } catch (error) {

    console.error(error);

    quizList.innerHTML =
      "<p>Error loading quizzes.</p>";
  }
}


// ======================
// Render Quizzes
// ======================

function renderQuizzes() {

  quizList.innerHTML = "";

  const filter =
    filterSelect.value;

  const searchTerm =
    searchInput.value.toLowerCase();

  const filtered = allQuizzes.filter(q => {

    const matchesFilter =

      filter === "current"

      ? q.status === "active-quiz"
        || q.status === "upcoming"

      : filter === "expired"

      ? q.status === "expired"

      : true;

    const matchesSearch =
      (q.title || "")
      .toLowerCase()
      .includes(searchTerm);

    return matchesFilter && matchesSearch;
  });


  if (filtered.length === 0) {

    quizList.innerHTML =
      "<p>No quizzes found.</p>";

    return;
  }


  filtered.forEach(q => {

    const div =
      document.createElement("div");

    div.classList.add(
      "quiz-card",
      q.status
    );

    const statusText =

      q.status === "active-quiz"

      ? "🟢 Open Now"

      : q.status === "upcoming"

      ? "🕒 Not Yet Open"

      : "🔴 Closed";


    const buttonLabel =

      q.status === "expired"

      ? "View Quiz"

      : q.status === "upcoming"

      ? "Wait to Open"

      : "Open Quiz";


    div.innerHTML = `

      <h3>${q.title || "Untitled Quiz"}</h3>

      ${q.description
        ? `<p>${q.description}</p>`
        : ""}

      <p>
        <strong>Teacher:</strong>
        ${q.teacher || "Unknown"}
      </p>

      <p>
        <strong>Open:</strong>
        ${q.start.toLocaleString()}
      </p>

      <p>
        <strong>Close:</strong>
        ${q.end.toLocaleString()}
      </p>

      <p>
        <strong>Status:</strong>
        ${statusText}
      </p>

      <button class="quiz-btn">
        ${buttonLabel}
      </button>
    `;


    div
      .querySelector(".quiz-btn")
      .addEventListener("click", () => {

        if (q.status === "upcoming") {

          alert("🕒 This quiz is not open yet.");

        } else {

          window.open(q.link, "_blank");
        }
      });

    quizList.appendChild(div);
  });
}


// Quiz Filters
filterSelect.addEventListener(
  "change",
  renderQuizzes
);

searchInput.addEventListener(
  "input",
  renderQuizzes
);


// ======================
// Load Notes
// ======================

async function loadNotes() {

  try {

    const snapshot = await getDocs(
      query(
        collection(db, "notes"),
        orderBy("createdAt", "desc")
      )
    );

    allNotes = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    renderNotes();

  } catch (error) {

    console.error(error);

    notesList.innerHTML =
      "<p>Error loading notes.</p>";
  }
}


// ======================
// Render Notes
// ======================

function renderNotes() {

  notesList.innerHTML = "";

  const searchTerm =
    searchNotes.value.toLowerCase();

  const filtered = allNotes.filter(n =>

    (n.title || "")
    .toLowerCase()
    .includes(searchTerm)
  );


  if (filtered.length === 0) {

    notesList.innerHTML =
      "<p>No notes found.</p>";

    return;
  }


  filtered.forEach(n => {

    const div =
      document.createElement("div");

    div.classList.add("note-card");

    div.innerHTML = `

      <h3>${n.title || "Untitled Note"}</h3>

      <p>
        <strong>Teacher:</strong>
        ${n.teacher || "Unknown"}
      </p>

      <p>
        <a href="${n.link || "#"}"
           target="_blank">
           📄 Open Notes
        </a>
      </p>
    `;

    notesList.appendChild(div);
  });
}


// Notes Search
searchNotes.addEventListener(
  "input",
  renderNotes
);


// ======================
// Navigation
// ======================

const navButtons =
  document.querySelectorAll(".nav-btn");

const sections =
  document.querySelectorAll("section");

navButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    navButtons.forEach(b =>
      b.classList.remove("active")
    );

    btn.classList.add("active");

    const target =
      btn.dataset.target;

    sections.forEach(s =>
      s.classList.remove("active")
    );

    document
      .getElementById(target)
      .classList.add("active");
  });
});


// ======================
// Logout
// ======================

logoutBtn.addEventListener(
  "click",
  async () => {

    await signOut(auth);

    window.location.href =
      "student-login.html";
  }
);
