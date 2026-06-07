// ═══════════════════════════════════════════════════════════
//  CONFIG — paste your keys here (this is the ONLY file
//  you ever need to edit)
// ═══════════════════════════════════════════════════════════

// ── Firebase (Firestore for product data) ─────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCXobqUgOf3cKbUMUWpX-sXjzFp-_m9AqM",
  authDomain: "bobs-bakery-5fe92.firebaseapp.com",
  databaseURL: "https://bobs-bakery-5fe92-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bobs-bakery-5fe92",
  storageBucket: "bobs-bakery-5fe92.firebasestorage.app",
  messagingSenderId: "927968344576",
  appId: "1:927968344576:web:afc0addede269dea8276e5",
  measurementId: "G-K239PP7ZPL"
};


// ── Cloudinary (free image hosting — no credit card) ──────
// Sign up free at cloudinary.com → Dashboard → copy these 3 values
const CLOUDINARY_CONFIG = {
    cloudName:   "PASTE_YOUR_cloud_name_HERE",   // e.g. "dxyz1234"
    uploadPreset:"PASTE_YOUR_upload_preset_HERE"  // e.g. "bakery_unsigned"
};

// ── WhatsApp ──────────────────────────────────────────────
const WHATSAPP_NUMBER = "27681932383";


//// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXobqUgOf3cKbUMUWpX-sXjzFp-_m9AqM",
  authDomain: "bobs-bakery-5fe92.firebaseapp.com",
  databaseURL: "https://bobs-bakery-5fe92-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bobs-bakery-5fe92",
  storageBucket: "bobs-bakery-5fe92.firebasestorage.app",
  messagingSenderId: "927968344576",
  appId: "1:927968344576:web:afc0addede269dea8276e5",
  measurementId: "G-K239PP7ZPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXobqUgOf3cKbUMUWpX-sXjzFp-_m9AqM",
  authDomain: "bobs-bakery-5fe92.firebaseapp.com",
  databaseURL: "https://bobs-bakery-5fe92-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bobs-bakery-5fe92",
  storageBucket: "bobs-bakery-5fe92.firebasestorage.app",
  messagingSenderId: "927968344576",
  appId: "1:927968344576:web:afc0addede269dea8276e5",
  measurementId: "G-K239PP7ZPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);*/
