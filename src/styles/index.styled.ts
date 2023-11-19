import styled from "styled-components";

export const ImageWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  min-height: 100vh;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 3rem 0;
  }
`;

export const Image = styled.img`
  width: 50%;
  object-fit: cover;
  z-index: 1;

  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 100%;
  }
`;

export const Row = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "reverse",
})<{ reverse?: boolean }>`
  display: flex;
  height: 600px;
  flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    height: auto;
    flex-direction: column;
  }
`;

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 2rem;

  @media (min-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 50%;
  }
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-family: "Nantes", sans-serif;
  color: ${({ theme }) => theme.colors.secondary};
  backdrop-filter: blur(3px) saturate(70%);
  margin: 0;
`;

export const SubTitle = styled.p`
  font-size: 2rem;
  line-height: 1.5;
  font-weight: 800;
  text-rendering: optimizelegibility !important;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.secondary};
  backdrop-filter: blur(3px) saturate(70%);
`;
