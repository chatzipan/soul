import styled, { css } from "styled-components";

const commonWrapper = css`
  padding: 5rem;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.primary};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: calc(50% - 30vw);
    margin: 0 auto;
    height: 1px;
    display: block;
    width: 60vw;
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 2rem;
  }
`;

export const Wrapper = styled.div`
  ${commonWrapper}
`;

export const DinnerWrapper = styled.div`
  ${commonWrapper}

  padding-top: 2rem;
`;

export const WineWrapper = styled.div`
  ${commonWrapper}
`;

export const EventWrapper = styled.div`
  ${commonWrapper}
`;

export const FoodWrapper = styled.div`
  ${commonWrapper}
`;

export const Heading = styled.div`
  gap: 7rem;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.secondary};

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

export const Title = styled.p`
  font-size: 3rem;
  font-family: "Josefin Sans", sans-serif;
  line-height: 1.5;
  flex-shrink: 0;
  margin: 0;
  text-transform: uppercase;
`;

export const Description = styled.p.withConfig({
  shouldForwardProp: (prop) => !["full"].includes(prop),
})<{ full?: boolean }>`
  font-family: "Josefin Sans", sans-serif;
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.5;
  width: ${({ full }) => (full ? "100%" : "60%")};
  word-break: break-word;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 100%;
    order: 1;
  }
`;

export const ImageOuterWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
  }
`;

export const ImageWrapper = styled.div`
  width: calc(100% / 2 - 2rem);
  border-radius: 0.5rem;
  overflow: hidden;
  flex-grow: 1;
  object-fit: cover;

  & div {
    height: 100%;
  }

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 100%;
  }
`;

export const FoodImageWrapper = styled.div`
  width: calc(40%);
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    width: calc(100% / 2 - 2rem);
  }

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 100%;
  }
`;

export const TelLink = styled.a`
  color: inherit;
  text-decoration-thickness: from-font;
  font-family: "Josefin Sans", sans-serif;
`;
