import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  display: flex;
  height: 100vh;
`;

export const ImageWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;

  &::before {
    content: "";
    position: fixed;
    width: 200%;
    height: 800%;
    top: -150%;
    left: 50%;
    z-index: -1;

    background: url("logo.svg") 0 0 repeat;
    background-size: 200px;

    transform: rotate(-30deg);
  }

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 3rem 0;
  }
`;

export const MapWrapper = styled.section`
  height: 600px;
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

export const Row = styled.div<{ reverse?: boolean }>`
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
  font-family: "Nantes", sans-serif;
  font-size: 2rem;
  line-height: 1.5;
  font-weight: 800;
  text-rendering: optimizelegibility !important;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.secondary};
  backdrop-filter: blur(3px) saturate(70%);
`;

export const Marker = styled.img.withConfig({
  shouldForwardProp: (prop) => !["lat", "lng"].includes(prop),
})<{ lat: number; lng: number }>`
  transform: translate(-50%, -50%);
  width: 40px;
  height: auto;
  cursor: pointer;
`;

export const Main = styled.div`
  width: calc((2 / 3) * 100%);
  overflow-x: hidden;
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    width: 100%;
  }
`;
