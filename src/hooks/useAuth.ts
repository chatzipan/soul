import { useContext } from "react";

import { AuthContext, AuthContextType } from "../providers/AuthProvider";

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth used outside of ContextProvider!");
  } else {
    return ctx;
  }
};
