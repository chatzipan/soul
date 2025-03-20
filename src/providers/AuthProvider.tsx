import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { navigate } from "gatsby";

import { User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import _firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { uiConfig as _uiConfig, firebase } from "../services/firebase";

export type AuthContextType = {
  firebaseUiConfig: firebaseui.auth.Config;
  firebase: typeof _firebase;
  isLoggedIn: boolean;
  logout: () => void;
  token: string | null;
  user: User | null;
  forceReauthenticate: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  firebaseUiConfig: _uiConfig,
  firebase: firebase,
  isLoggedIn: false,
  logout: () => {},
  token: null,
  user: null,
  forceReauthenticate: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const forceReauthenticate = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/admin/login");
  }, []);

  const firebaseUiConfig = useMemo(
    () =>
      ({
        ..._uiConfig,
        callbacks: {
          signInSuccessWithAuthResult: (authResult) => {
            setUser(authResult.user);
            return true;
          },
        },
      }) as firebaseui.auth.Config,
    [setUser],
  );

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (_user) => {
      if (_user) {
        try {
          const idToken = await _user.getIdToken(true);
          setUser(_user);
          setToken(idToken);
          localStorage.setItem("token", idToken);
        } catch (error) {
          console.error("Failed to get token:", error);
          forceReauthenticate();
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
      setHasLoaded(true);
    });

    return () => unsubscribe();
  }, [forceReauthenticate]);

  const isLoggedIn = Boolean(user);

  const logout = useCallback(() => {
    firebase.auth().signOut();
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }, []);

  const value = useMemo(
    () => ({
      firebase,
      firebaseUiConfig,
      isLoggedIn,
      logout,
      token,
      user,
      forceReauthenticate,
    }),
    [firebaseUiConfig, isLoggedIn, logout, token, user, forceReauthenticate],
  );

  if (!hasLoaded) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
