import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS_aQO9iSAd43uHPJhfyFSz1RSJ9XaaW8",
  authDomain: "test-b4a95.firebaseapp.com",
  projectId: "test-b4a95",
  storageBucket: "test-b4a95.appspot.com",
  messagingSenderId: "254783288201",
  appId: "1:254783288201:web:ebf3bdd80861a51a75e758",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Ensure AsyncStorage is installed
});