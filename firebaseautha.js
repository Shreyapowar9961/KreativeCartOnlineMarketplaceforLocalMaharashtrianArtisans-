// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGiLPJ_4uGvHS9Ix7yQv9A-t47jQFAIY8",
  authDomain: "artisan-login-57cbf.firebaseapp.com",
  projectId: "artisan-login-57cbf",
  storageBucket: "artisan-login-57cbf.firebasestorage.app",
  messagingSenderId: "487893760848",
  appId: "1:487893760848:web:67b7c85ee0fd1752a80a55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Function to show messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Handle Register Form submission
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      const userData = {
        email: email,
      };

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          showMessage('Account Created Successfully', 'registerMessage');
          window.location.href = 'artisandetails.html'; // Redirect after successful registration
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
          showMessage('Error creating user data in Firestore', 'registerMessage');
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists!!!', 'registerMessage');
      } else {
        showMessage('Unable to create user', 'registerMessage');
      }
    });
});

// Handle Login Form submission
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('lEmail').value;
  const password = document.getElementById('lPassword').value;

  const auth = getAuth();

  console.log("Login attempt with email:", email, "and password:", password); // Debugging step

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Login successful:", user); // Debugging step

      showMessage('Login Successful', 'loginMessage');

      window.location.href = 'upload.html'; // Redirect to the artisan account page
    })
    .catch((error) => {
      const errorCode = error.code;
      console.error("Login error:", error); // Debugging step

      if (errorCode === 'auth/user-not-found') {
        showMessage('User not found! Please register first.', 'loginMessage');
      } else if (errorCode === 'auth/wrong-password') {
        showMessage('Incorrect password. Please try again.', 'loginMessage');
      } else {
        showMessage('Login failed. Please try again.', 'loginMessage');
      }
    });
});
