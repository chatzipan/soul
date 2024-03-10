import React from "react";

import { useAuth } from "../../../hooks/useAuth";
import * as S from "./Layout.styled";
import TopBar from "./TopBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn && <TopBar />}
      <S.Wrapper>{children}</S.Wrapper>
    </>
  );
}
