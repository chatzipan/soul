import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Icon from "../assets/logo.svg";
import styled from "styled-components";
import latteArt from "../images/latte_art.png"; // Tell webpack this JS file uses this image
import babka from "../images/babka.png"; // Tell webpack this JS file uses this image
import { size } from "../config/mediaQueries";

const Logo = styled(Icon)`
  width: 80vw;
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

const LatteArtWrapper = styled.div`
  --size: 100px;

  @media (min-width: ${size.tablet}) {
    --size: 300px;
  }

  width: var(--size);
  height: auto;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  animation: x 23s linear infinite alternate, spin 24s linear infinite;

  @keyframes x {
    100% {
      transform: translateX(calc(100vw - var(--size)));
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const BabkaWrapper = styled.div`
  --size: 100px;

  @media (min-width: ${size.tablet}) {
    --size: 300px;
  }

  width: var(--size);
  height: auto;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  animation: x 23s linear infinite alternate, spin 24s linear infinite;

  @keyframes x {
    100% {
      transform: translateX(calc(100vw + var(--size)));
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LatteArt = styled.img`
  --size: 100px;

  @media (min-width: ${size.tablet}) {
    --size: 300px;
  }

  width: var(--size);
  height: auto;
  animation: y 17s linear infinite alternate;

  @keyframes y {
    100% {
      transform: translateY(calc(100vh - 225px));
    }
  }
`;

const Babka = styled.img`
  --size: 100px;

  @media (min-width: ${size.tablet}) {
    --size: 300px;
  }

  width: var(--size);
  height: auto;
  animation: y 17s linear infinite alternate;

  @keyframes y {
    100% {
      transform: translateY(calc(100vh + 225px));
    }
  }
`;

const ComingSoon = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 4rem;
`;

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Main>
      <LatteArtWrapper>
        <LatteArt src={latteArt} />
      </LatteArtWrapper>
      <BabkaWrapper>
        <Babka src={babka} />
      </BabkaWrapper>
      <Logo />
      <ComingSoon>coming soon...</ComingSoon>
    </Main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Soul - Specialty Culture</title>;
