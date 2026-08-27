const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBqJDhYHquTkFHTm35HkfSLZBzLHFLnmns",
  authDomain: "willyann-portifilio.firebaseapp.com",
  projectId: "willyann-portifilio",
  storageBucket: "willyann-portifilio.firebasestorage.app",
  messagingSenderId: "52245895377",
  appId: "1:52245895377:web:6935698036704275954df0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };