import firebase, { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { firebaseClientConfig } from "./config";

const createFirebaseApp = (config: FirebaseOptions) => {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
};

const firebaseApp = createFirebaseApp(firebaseClientConfig);
export const firebaseAuth = getAuth(firebaseApp);

export default firebase;
