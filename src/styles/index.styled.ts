import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  display: flex;
  height: 100vh;
`;

export const ImageWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  padding: 4rem;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 2rem;
  }
`;

export const MapWrapper = styled.section`
  height: 600px;
`;

export const Image = styled.img`
  width: 50%;
  border-radius: 5rem;
  object-fit: cover;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 100%;
  }
`;

export const Row = styled.div<{ reverse?: boolean }>`
  display: flex;
  gap: 2rem;
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
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-family: "Nantes", sans-serif;
`;

export const SubTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 800;
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
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    width: 100%;
  }
`;
