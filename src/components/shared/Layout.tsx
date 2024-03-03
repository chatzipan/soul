import React from "react";
import { createGlobalStyle } from "styled-components";

import * as S from "./Layout.styled";

const GlobalStyle = createGlobalStyle`
  html {
    font-family: "Adrianna Extended Thin", sans-serif;
  }

  body {
    padding: 0;
    margin: 0;
  }

  @font-face {
    font-family: "Adrianna Extended Thin";
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;
    font-named-instance: "Regular";
    src: url(/fonts/AdriannaExtended-Thin.woff2) format("woff2");
  }

  @font-face {
    font-family: "Nantes";
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;
    font-named-instance: "Regular";
    src: url(/fonts/Nantes-Regular.woff2) format("woff2");
  }
`;

const inputGlobalStyles = <GlobalStyle />;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <React.Fragment>
      {inputGlobalStyles}
      <S.Page>
        <S.Main id='main'>{children}</S.Main>
      </S.Page>
    </React.Fragment>
  );
}
