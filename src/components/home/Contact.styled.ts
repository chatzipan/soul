import styled from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  padding: 5rem 0;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 3rem 0;
  }
`;

export const MapWrapper = styled.section`
  margin-top: auto;
  height: 600px;
`;

export const Marker = styled.img.withConfig({
  shouldForwardProp: (prop) => !["lat", "lng"].includes(prop),
})<{ lat: number; lng: number }>`
  transform: translate(-50%, -50%);
  width: 40px;
  height: auto;
  cursor: pointer;
`;

export const SubTitle = styled.p`
  font-size: 2rem;
  line-height: 1.5;
  font-weight: 800;
  text-rendering: optimizelegibility !important;
  letter-spacing: 0.03em;
  color: ${({ theme }) => theme.colors.secondary};
  backdrop-filter: blur(3px) saturate(70%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
`;

export const TelLink = styled.a`
  color: inherit;
  text-decoration: none;
`;
