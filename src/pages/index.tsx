import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Icon from "../assets/logo.svg";
import styled from "styled-components";

const Logo = styled(Icon)`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: block;
  color: white;
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
`;

const ComingSoon = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 4rem;
`;

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Main>
      <Logo />
      <ComingSoon>coming soon...</ComingSoon>
    </Main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
