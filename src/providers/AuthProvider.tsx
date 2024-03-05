import "firebase/compat/auth";

import { User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import _firebase from "firebase/compat/app";
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
  isLoggedIn: boolean;
  logout: () => void;
  token: string | null;
  user: User | null;
};

export const AuthContext = createContext<AuthContextType>({
  firebaseUiConfig: _uiConfig,
  firebase: firebase,
  isLoggedIn: false,
  logout: () => {},
  token: null,
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [token, setToken] = useState<string | null>(null);
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

    onAuthStateChanged(auth, async (_user) => {
      if (_user) {
        setUser(_user);
        const idToken = await _user.getIdToken();
        setToken(idToken);
        localStorage.setItem("token", idToken);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
      setHasLoaded(true);
    });
  }, []);

  const isLoggedIn = Boolean(user);

  const logout = useCallback(() => {
    firebase.auth().signOut();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ firebase, firebaseUiConfig, isLoggedIn, logout, token, user }),
    [firebase, firebaseUiConfig, isLoggedIn, logout, token, user]
  );

  if (!hasLoaded) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
