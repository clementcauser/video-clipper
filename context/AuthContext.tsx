import { firebaseCookieName } from "@constants";
import { firebaseAuth } from "@firebase/client";
import { User } from "firebase/auth";
import nookies from "nookies";
import { createContext, FC, useEffect, useState } from "react";

type AuthContextType = {
  user?: User | null;
};

export const AuthContext = createContext<AuthContextType>({});

/**
 * @description
 * This context manages authenticated user state and watch for auth changes (including cookie management)
 */
const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // watch firebase auth state
    // if token is changed then it set new values (both cookie and state)
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        // empty cookie value
        nookies.set(undefined, firebaseCookieName, "", {});
        setCurrentUser(null);
      } else {
        // get user token
        const token = await user.getIdToken();
        // set cookie value
        nookies.set(undefined, firebaseCookieName, token, {
          secure: process.env.NODE_ENV !== "development",
          maxAge: 30 * 24 * 60 * 60,
        });

        setCurrentUser(user);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
