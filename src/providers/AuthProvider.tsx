import "firebase/compat/auth";

import { User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import _firebase from "firebase/compat/app";
import { navigate } from "gatsby";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { uiConfig as _uiConfig, firebase } from "../services/firebase";

export type AuthContextType = {
  firebaseUiConfig: firebaseui.auth.Config;
  firebase: typeof _firebase;
  isLoggedIn: () => boolean;
  logout: () => void;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType>({
  firebaseUiConfig: _uiConfig,
  firebase: firebase,
  isLoggedIn: () => false,
  logout: () => {},
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const firebaseUiConfig = {
    ..._uiConfig,
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        setUser(authResult.user);
        return true;
      },
    },
  } as firebaseui.auth.Config;

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        setUser(_user);
        // navigate("/admin");
      } else {
        setUser(null);
      }
      setHasLoaded(true);
    });
  }, []);

  const isLoggedIn = useCallback(() => Boolean(user), [user]);

  const logout = useCallback(() => {
    firebase.auth().signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ firebase, firebaseUiConfig, isLoggedIn, logout, user }),
    [isLoggedIn, logout, firebase, firebaseUiConfig, user]
  );

  if (!hasLoaded) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
