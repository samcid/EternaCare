import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBy5FUck_qLIU-SWEdurzMv3zSvVQFj1pQ",
  authDomain: "astaswiss-firebase.firebaseapp.com",
  projectId: "astaswiss-firebase",
  storageBucket: "astaswiss-firebase.appspot.com",
  messagingSenderId: "587196675785",
  appId: "1:587196675785:web:c7ca0d1670e5d388a43f18",
  measurementId: "G-9MNGN2TQXT"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
