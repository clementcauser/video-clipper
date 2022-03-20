import { db } from "@firebase/client";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";

type CollectionParams = {
  documentName: string;
  pathSegments?: string[];
};

export const createTypedCollection = <T = DocumentData>(
  documentName: string
) => {
  return doc(collection(db, documentName)) as DocumentReference<T>;
};

export const createTypedDocument = <T = DocumentData>(
  documentName: string,
  documentUid: string
) => {
  return doc(db, documentName, documentUid) as DocumentReference<T>;
};
