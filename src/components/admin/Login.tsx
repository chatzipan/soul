import "firebase/compat/auth";

import React from "react";

import { RouteComponentProps } from "@reach/router";

import { useAuth } from "../../hooks/useAuth";
import * as S from "./Login.styled";
import StyledFirebaseAuth from "./StyledFirebaseAuth";

const Login = (_: RouteComponentProps) => {
  const { firebase, firebaseUiConfig } = useAuth();

  return (
    <S.Wrapper>
      <h1>Login</h1>
      <StyledFirebaseAuth
        uiConfig={firebaseUiConfig}
        firebaseAuth={firebase.auth()}
      />
    </S.Wrapper>
  );
};

export default Login;
