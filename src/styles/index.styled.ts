import styled, { css } from "styled-components";

import Icon from "../assets/logo.svg";

export const Logo = styled(Icon)`
  width: 80vw;
  max-width: 700px;
  margin: 0 auto;
  display: block;
  color: white;
`;

export const Marker = styled.img.withConfig({
  shouldForwardProp: (prop) => !["lat", "lng"].includes(prop),
})<{ lat: number; lng: number }>`
  transform: translate(-50%, -50%);
  // transform: translate(-50px, -66px);
  width: 40px;
  height: auto;
`;

export const MapWrapper = styled.div`
  height: 30vh;
  width: 100%;
`;

export const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
`;

export const LatteArtWrapper = styled.div(
  ({ theme }) => css`
    --size: 100px;

    @media (min-width: ${theme.sizes.tablet}) {
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
  `
);

export const BabkaWrapper = styled.div(
  ({ theme }) => css`
    --size: 100px;

    @media (min-width: ${theme.sizes.tablet}) {
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
  `
);

export const LatteArt = styled.img(
  ({ theme }) => css`
    --size: 100px;

    @media (min-width: ${theme.sizes.tablet}) {
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
  `
);

export const Babka = styled.img(
  ({ theme }) => css`
    --size: 100px;

    @media (min-width: ${theme.sizes.tablet}) {
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
  `
);

export const ComingSoon = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 4rem;
`;
