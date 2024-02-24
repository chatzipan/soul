import "firebase/compat/auth";

import { navigate } from "gatsby";
import React from "react";

import { RouteComponentProps } from "@reach/router";

import { useAuth } from "../../hooks/useAuth";
import { isBrowser } from "../../utils/isBrowser";
import * as S from "./Login.styled";

const StyledFirebaseAuth = React.lazy(() => import("./StyledFirebaseAuth"));

const Login = (_: RouteComponentProps) => {
  const { firebase, firebaseUiConfig, isLoggedIn } = useAuth();
  const isSSR = typeof window === "undefined";

  if (isBrowser() && isLoggedIn()) {
    navigate("/admin");
    return null;
  }

  return (
    <S.Wrapper>
      <h1>Login</h1>

      {!isSSR && (
        <React.Suspense fallback={<div />}>
          <StyledFirebaseAuth
            uiConfig={firebaseUiConfig}
            firebaseAuth={firebase.auth()}
          />
        </React.Suspense>
      )}
    </S.Wrapper>
  );
};

export default Login;
