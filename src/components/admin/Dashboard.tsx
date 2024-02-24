import "firebase/compat/auth";

import React from "react";

import { RouteComponentProps } from "@reach/router";

import { useAuth } from "../../hooks/useAuth";
import * as S from "./Login.styled";

const Dashboard = (_: RouteComponentProps) => {
  return (
    <S.Wrapper>
      <h1>Admin Dashboard</h1>
    </S.Wrapper>
  );
};

export default Dashboard;
