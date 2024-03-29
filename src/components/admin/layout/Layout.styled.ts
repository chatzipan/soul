import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  flex-direction: column;
  padding: 3rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 1.5rem;
  }
`;
