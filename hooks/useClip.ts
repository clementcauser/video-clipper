import { IClip } from "@interfaces";
import { createTypedCollection, createTypedDocument } from "@utils/firestore";
import {
  deleteDoc,
  FirestoreError,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useState } from "react";

const clipCollectionRef = createTypedCollection<IClip>("clips");

const getClipDocumentRef = (clipUid: string) =>
  createTypedDocument<IClip>("clips", clipUid);

const createClipFunction = async (payload: IClip) => {
  return setDoc<IClip>(clipCollectionRef, payload);
};

const updateClipFunction = async (payload: IClip) => {
  return updateDoc<IClip>(getClipDocumentRef(payload.uid), payload);
};

const deleteClipFunction = async (clipUid: string) => {
  return deleteDoc(getClipDocumentRef(clipUid));
};

type HookOptions = {
  onSuccess: () => void;
  onFailure: (error: FirestoreError) => void;
};

const useClip = (
  mutationFn: Function, // typing must be improved
  { onFailure, onSuccess }: HookOptions
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  const mutate = useCallback(
    // params typing must be improved
    async (params) => {
      try {
        setIsLoading(true);

        // since every mutation function returns a Promise<void>
        // returning it is not useful, executing it is enough
        mutationFn(params);

        onSuccess();
      } catch (err) {
        setError(err as FirestoreError);

        onFailure(err as FirestoreError);
      } finally {
        setIsLoading(false);
      }
    },
    [onFailure, onSuccess, mutationFn]
  );

  return { mutate, isLoading, error };
};

type Feedback = {
  type: "error" | "success";
  message: string;
};

// clip creation hook shortcut
export const useClipCreate = (onFeedback: (feedback: Feedback) => void) => {
  const {
    mutate: createClip,
    error: creationError,
    isLoading: isCreationLoading,
  } = useClip(createClipFunction, {
    onFailure: (err) =>
      onFeedback({
        type: "error",
        message: err.message,
      }),
    onSuccess: () => {
      onFeedback({ type: "success", message: "Clip créé avec succès !" });
    },
  });

  return {
    createClip,
    creationError,
    isCreationLoading,
  };
};

// clip deletion hook shortcut
export const useClipDelete = (onFeedback: (feedback: Feedback) => void) => {
  const {
    mutate: deleteClip,
    error: deleteError,
    isLoading: isDeleteLoading,
  } = useClip(deleteClipFunction, {
    onFailure: (err) =>
      onFeedback({
        type: "error",
        message: err.message,
      }),
    onSuccess: () => {
      onFeedback({ type: "success", message: "Clip supprimé avec succès !" });
    },
  });

  return {
    deleteClip,
    deleteError,
    isDeleteLoading,
  };
};

export const useClipUpdate = (onFeedback: (feedback: Feedback) => void) => {
  const {
    mutate: updateClip,
    error: updateError,
    isLoading: isUpdateLoading,
  } = useClip(updateClipFunction, {
    onFailure: (err) =>
      onFeedback({
        type: "error",
        message: err.message,
      }),
    onSuccess: () => {
      onFeedback({ type: "success", message: "Clip mis à jour avec succès !" });
    },
  });

  return {
    updateClip,
    updateError,
    isUpdateLoading,
  };
};

export default useClip;
