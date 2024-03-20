import React from "react";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <meta name={"robots"} content={"noindex, nofollow"} />
      </Helmet>
      <S.Wrapper>{children}</S.Wrapper>
    </>
  );
}
