import { Route } from "@constants";
import { firebaseAuth } from "@firebase/client";
import { unstable_useEnhancedEffect } from "@mui/material";
import { AuthContext } from "context";
import { AuthError, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useCallback, useContext, useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

type WithEmailAndPasswordPayload = {
  email: string;
  password: string;
};

/**
 * @description
 * This hook manages auth actions (signIn & signOut), loading and errors.
 * @param onSignInSuccess execute a function is sign in has performed successfuly
 */
const useAuth = (onSignInSuccess?: () => void) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string>();

  const [signInWithGithub, githubUser, githubLoading, githubError] =
    useSignInWithGithub(firebaseAuth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(firebaseAuth);

  const [signInWithEmailAndPassword, emailUser, emailLoading, emailError] =
    useSignInWithEmailAndPassword(firebaseAuth);

  const [
    createUserWithEmailAndPassword,
    createdUser,
    creationLoading,
    creationError,
  ] = useCreateUserWithEmailAndPassword(firebaseAuth);

  unstable_useEnhancedEffect(() => {
    // in order to be easier to use we mix up all signIn errors
    setErrorMessage(
      (githubError || googleError || emailError || creationError)?.message
    );
  }, [githubError, googleError, emailError, creationError]);

  // memoize function for better performance
  const handleSignInAndRedirection = useCallback(
    async (
      signInFunction: () => Promise<void>,
      error?: AuthError,
      redirection: Route = Route.HOME
    ) => {
      try {
        // execute the signIn function
        await signInFunction();

        // allow developer to add an action if it's success
        if (onSignInSuccess && !error?.message) {
          onSignInSuccess();
        }

        // redirect user
        router.push(redirection);
      } catch (err) {
        throw Error("An error occured while trying to login");
      }
    },
    [onSignInSuccess, router]
  );

  return {
    user,
    withGithub: {
      signIn: () => handleSignInAndRedirection(signInWithGithub, githubError),
      loading: githubLoading,
      error: githubError,
    },
    withGoogle: {
      signIn: () => handleSignInAndRedirection(signInWithGoogle, googleError),
      loading: googleLoading,
      error: googleError,
    },
    withEmailAndPassword: {
      signIn: ({ email, password }: WithEmailAndPasswordPayload) =>
        handleSignInAndRedirection(
          () => signInWithEmailAndPassword(email, password),
          emailError
        ),
      signUp: ({ email, password }: WithEmailAndPasswordPayload) =>
        handleSignInAndRedirection(
          () => createUserWithEmailAndPassword(email, password),
          emailError,
          Route.LOGIN
        ),
      loading: emailLoading || creationLoading,
      error: emailError || creationError,
    },
    error: { message: errorMessage, reset: () => setErrorMessage(undefined) },
    signOut: async () => {
      await signOut(firebaseAuth);

      // after logout, user is redirected to the login page
      router.push(Route.LOGIN);
    },
  };
};

export default useAuth;
