import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  display: flex;
  height: 100vh;
`;

export const Main = styled.main`
  overflow-x: hidden;
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    width: 100%;
  }
`;
