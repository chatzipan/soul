import React from "react";

import { RouteComponentProps } from "@reach/router";

import { useAuth } from "../../hooks/useAuth";
import * as S from "./Profile.styled";

const Profile = (_: RouteComponentProps) => {
  const { logout } = useAuth();

  return (
    <S.Wrapper>
      <button onClick={logout}>LOG OUT</button>
      <h1>Your profile</h1>
      <ul>
        <li>Name: Your name will appear here</li>
        <li>E-mail: And here goes the mail</li>
      </ul>
    </S.Wrapper>
  );
};

export default Profile;
