import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  getAuth,
  signOut,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


// Firebase configuration
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


// ======================
// Navigation
// ======================

document.querySelectorAll(".nav-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    document
      .querySelectorAll(".nav-btn")
      .forEach(b => b.classList.remove("active"));

    document
      .querySelectorAll("section")
      .forEach(s => s.classList.remove("active"));

    btn.classList.add("active");

    document
      .querySelector(btn.dataset.target)
      .classList.add("active");
  });
});


// ======================
// Authentication
// ======================

onAuthStateChanged(auth, user => {

  if (!user) {

    window.location.href = "teacher_login.html";
  }
});

document
  .getElementById("logoutBtn")
  .addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "teacher_login.html";
  });


// ======================
// Add Student
// ======================

const studentForm =
  document.getElementById("studentForm");

const studentsTable =
  document.getElementById("studentsTable");

studentForm.addEventListener("submit", async e => {

  e.preventDefault();

  try {

    const name =
      studentName.value.trim();

    const email =
      studentEmail.value.trim();

    const studentClassVal =
      studentClass.value;

    await addDoc(collection(db, "students"), {

      name,
      email,
      class: studentClassVal,
      createdAt: serverTimestamp()

    });

    alert("✅ Student added successfully!");

    e.target.reset();

    loadStudents();

  } catch (err) {

    alert(err.message);
  }
});


async function loadStudents() {

  const snap =
    await getDocs(query(collection(db, "students")));

  studentsTable.innerHTML = "";

  if (snap.empty) {

    studentsTable.innerHTML = `
      <tr>
        <td colspan="4">
          No students found
        </td>
      </tr>
    `;

    return;
  }

  snap.forEach(docSnap => {

    const s = docSnap.data();

    const id = docSnap.id;

    studentsTable.innerHTML += `
      <tr>
        <td>${s.name || ""}</td>
        <td>${s.email || ""}</td>
        <td>${s.class || ""}</td>
        <td>
          <button
            class="delete-btn"
            onclick="deleteStudent('${id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}


window.deleteStudent = async function(id) {

  if (!confirm("Delete this student?")) return;

  await deleteDoc(doc(db, "students", id));

  alert("✅ Student deleted");

  loadStudents();
};


// ======================
// Quiz Functions
// ======================

const quizForm =
  document.getElementById("quizForm");

const quizzesTable =
  document.getElementById("quizzesTable");

quizForm.addEventListener("submit", async e => {

  e.preventDefault();

  try {

    const data = {

      title:
        quizTitle.value.trim(),

      description:
        quizDescription.value.trim(),

      link:
        quizLink.value.trim(),

      open:
        openTime.value,

      close:
        closeTime.value,

      teacher:
        auth.currentUser?.email || "Unknown",

      createdAt:
        serverTimestamp()
    };

    await addDoc(
      collection(db, "teacher_quizzes"),
      data
    );

    alert("✅ Quiz added successfully!");

    e.target.reset();

    loadQuizzes();

  } catch (err) {

    alert(err.message);
  }
});


async function loadQuizzes() {

  const snap =
    await getDocs(query(collection(db, "teacher_quizzes")));

  quizzesTable.innerHTML = "";

  if (snap.empty) {

    quizzesTable.innerHTML = `
      <tr>
        <td colspan="5">
          No quizzes available
        </td>
      </tr>
    `;

    return;
  }

  snap.forEach(docSnap => {

    const qz = docSnap.data();

    const id = docSnap.id;

    quizzesTable.innerHTML += `
      <tr>
        <td>${qz.title || ""}</td>
        <td>${qz.description || ""}</td>
        <td>${qz.open || ""}</td>
        <td>${qz.close || ""}</td>
        <td>
          <button
            class="delete-btn"
            onclick="deleteQuiz('${id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}


window.deleteQuiz = async function(id) {

  if (!confirm("Delete this quiz?")) return;

  await deleteDoc(doc(db, "teacher_quizzes", id));

  alert("✅ Quiz deleted");

  loadQuizzes();
};


// ======================
// Notes Functions
// ======================

const notesForm =
  document.getElementById("notesForm");

const notesTable =
  document.getElementById("notesTable");

notesForm.addEventListener("submit", async e => {

  e.preventDefault();

  try {

    await addDoc(collection(db, "notes"), {

      title:
        noteTitle.value.trim(),

      link:
        noteLink.value.trim(),

      teacher:
        auth.currentUser?.email || "Unknown",

      createdAt:
        serverTimestamp()
    });

    alert("✅ Notes uploaded!");

    e.target.reset();

    loadNotes();

  } catch (err) {

    alert(err.message);
  }
});


async function loadNotes() {

  const snap =
    await getDocs(query(collection(db, "notes")));

  notesTable.innerHTML = "";

  if (snap.empty) {

    notesTable.innerHTML = `
      <tr>
        <td colspan="3">
          No notes uploaded
        </td>
      </tr>
    `;

    return;
  }

  snap.forEach(docSnap => {

    const n = docSnap.data();

    const id = docSnap.id;

    notesTable.innerHTML += `
      <tr>
        <td>${n.title || ""}</td>

        <td>
          <a href="${n.link || "#"}"
             target="_blank">
             View
          </a>
        </td>

        <td>
          <button
            class="delete-btn"
            onclick="deleteNote('${id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}


window.deleteNote = async function(id) {

  if (!confirm("Delete this note?")) return;

  await deleteDoc(doc(db, "notes", id));

  alert("✅ Note deleted");

  loadNotes();
};


// ======================
// Initial Load
// ======================

loadStudents();

loadQuizzes();

loadNotes();