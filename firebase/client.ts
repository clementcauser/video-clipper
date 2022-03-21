import * as firebase from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { firebaseClientConfig } from "./config";

const createFirebaseApp = (config: firebase.FirebaseOptions) => {
  try {
    return firebase.getApp();
  } catch {
    return firebase.initializeApp(config);
  }
};

const firebaseApp = createFirebaseApp(firebaseClientConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export default firebase;
