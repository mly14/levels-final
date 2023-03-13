// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  limit,
  orderBy,
} from "firebase/firestore";
import { html, render } from "lit-html";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF9Oy2ZjKKnycoP3rGlCv_Y8LZPH-vXfs",
  authDomain: "levels-game.firebaseapp.com",
  projectId: "levels-game",
  storageBucket: "levels-game.appspot.com",
  messagingSenderId: "641795928071",
  appId: "1:641795928071:web:624971f2a15ac4a17a7aa2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize a messages array and create a reference to the messages database.
let messages = [];
const messagesRef = collection(db, "messages");

async function sendMessage(score, username) {
  console.log("Sending a message!");
  // Add some data to the messages collection
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      time: Date.now(),
      score: score,
      name: username,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

//Make the sendMessage function global
window.sendMessage = sendMessage;

function handleInput(e) {
  if (e.key == "Enter") {
    sendMessage(e.target.value);
    e.target.value = "";
    draw();
  }
}

// render(view(), document.body);

async function getAllMessages() {
  messages = [];

  const querySnapshot = await getDocs(
    query(messagesRef, orderBy("score", "desc"), limit(5))
  );
  querySnapshot.forEach((doc) => {
    let msgData = doc.data();
    messages.push(msgData);
  });

  console.log(messages);
  // render(view(), document.body);
}

getAllMessages();

// function view() {
//   return html` <div id="messages-container">
//     ${messages.map(
//       (msg) => html`<div class="messages-name">${msg.name}: ${msg.score}</div>`
//     )}
//   </div>`;
// }

function retrieve_scores() {
  return messages;
}

window.retrieve_scores = retrieve_scores;

// window.view = view;

onSnapshot(
  collection(db, "messages"),
  (snapshot) => {
    console.log("snap", snapshot);
    getAllMessages();
  },
  (error) => {
    console.error(error);
  }
);
