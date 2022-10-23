import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getDatabase } from "firebase/database";

import Constants from "expo-constants";

// Firebase config
// Firebase config
const firebaseConfig1 = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

const firebaseConfig = {
  apiKey: "AIzaSyCD6YzqrTIF_LILuhWeCyA4iCrluoGPtL0",
  authDomain: "testing-dev-proj.firebaseapp.com",
  databaseURL: "https://testing-dev-proj-default-rtdb.firebaseio.com",
  projectId: "testing-dev-proj",
  storageBucket: "testing-dev-proj.appspot.com",
  messagingSenderId: "72113637640",
  appId: "1:72113637640:web:86d3c07632d223bcf6c4bd",
};
// initialize firebase

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const fbDatabase = getDatabase(app);
export const firestoreDb = getFirestore(app);

export const fbTimestamp = Timestamp;
