import React from "react";
import { Helmet } from "react-helmet";

import { CircularProgress } from "@mui/material";

import { useAuth } from "../../../hooks/useAuth";
import * as S from "./Layout.styled";
import TopBar from "./TopBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { hasLoaded, isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn && <TopBar />}
      <Helmet>
        <meta name={"robots"} content={"noindex, nofollow"} />
      </Helmet>
      {!hasLoaded && <CircularProgress sx={{ mt: "49vh", ml: "49vw" }} />}
      <S.Wrapper>{children}</S.Wrapper>
    </>
  );
}
