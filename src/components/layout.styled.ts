import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  display: flex;
  height: 100vh;
`;

export const Main = styled.main`
  overflow-x: hidden;
  margin-left: auto;
  background-color: ${({ theme }) => theme.colors.secondary};

  /* &::before {
    content: "";
    position: fixed;
    width: 200%;
    height: 800%;
    top: -150%;
    left: 50%;
    z-index: -1;

    background: url(/svg/logo.svg) 0 0 repeat;
    background-size: 200px;

    transform: rotate(-30deg);
  } */

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    width: 100%;
  }
`;
