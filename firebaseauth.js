// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCJPD2ENAV0quu83S3A2F9KkDtpnmF46XA",
  authDomain: "customer-login-2593c.firebaseapp.com",
  projectId: "customer-login-2593c",
  storageBucket: "customer-login-2593c.appspot.com", // corrected storage bucket domain
  messagingSenderId: "516330296406",
  appId: "1:516330296406:web:e9e8bcf45ad471a6c697f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Utility function to show messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// REGISTER HANDLER
const registerBtn = document.getElementById('RegisterBtn');
registerBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = { email: email };

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          showMessage("Account Created Successfully", 'RegisterMessage');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        })
        .catch((error) => {
          console.error("Error writing document:", error);
          showMessage("Failed to save user data", 'RegisterMessage');
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage("Email Address Already Exists !!!", 'RegisterMessage');
      } else {
        showMessage("Unable to Create User", 'RegisterMessage');
      }
    });
});

// LOGIN HANDLER
const loginBtn = document.getElementById('Login');
loginBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      showMessage("Login is Successful", 'LoginMessage');
      setTimeout(() => {
        window.location.href = 'customerinfo.html';
      }, 2000);
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
        showMessage("Incorrect Email or Password", 'LoginMessage');
      } else if (errorCode === 'auth/user-not-found') {
        showMessage("Account Does Not Exist..!", 'LoginMessage');
      } else {
        showMessage("Login failed. Try again.", 'LoginMessage');
      }
    });
});
