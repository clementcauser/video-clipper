import admin from "firebase-admin";
import { firebaseAdminConfig } from "./config";

export const verifyTokenId = async (token: string) => {
  console.log("🚀 ~ file: admin.ts ~ line 5 ~ verifyTokenId ~ token", token);
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
    return null;
  }
};
