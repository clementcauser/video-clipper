import admin from "firebase-admin";
import { firebaseAdminConfig } from "./config";

export const verifyTokenId = async (token: string) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
      // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    return decodedToken;
  } catch (err) {
    throw err;
  }
};
