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
  apiKey: "AIzaSyBaebzRLSgqtnsTaIJm9sIJuyzvVb0CTUI",
  authDomain: "taskondemand-57aae.firebaseapp.com",
  databaseURL: "https://taskondemand-57aae-default-rtdb.firebaseio.com",
  projectId: "taskondemand-57aae",
  storageBucket: "taskondemand-57aae.appspot.com",
  messagingSenderId: "654031251764",
  appId: "1:654031251764:web:b9a86ecdea678f1190dd61",
};
// initialize firebase

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const fbDatabase = getDatabase(app);
export const firestoreDb = getFirestore(app);

export const fbTimestamp = Timestamp;
