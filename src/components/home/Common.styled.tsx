import styled, { css } from "styled-components";

const commonWrapper = css`
  padding: 5rem;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 3rem;
  }
`;

export const Wrapper = styled.div`
  ${commonWrapper}
`;

export const WineWrapper = styled.div`
  ${commonWrapper}
  background-color: #b88364;
`;

export const EventWrapper = styled.div`
  ${commonWrapper}
  background-color: #b9f6f8;
`;

export const FoodWrapper = styled.div`
  ${commonWrapper}
  background-color: #f5f5f5;
`;

export const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 7rem;
  margin-bottom: 3rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

export const Title = styled.p`
  font-size: 3rem;
  font-family: "Cabin", sans-serif;
  line-height: 1.5;
  flex-shrink: 0;
  margin: 0;
`;

export const WineTitle = styled.p`
  font-size: 3rem;
  font-family: "Cabin", sans-serif;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary};
  flex-shrink: 0;
  margin: 0;
`;

export const Description = styled.p.withConfig({
  shouldForwardProp: (prop) => !["full"].includes(prop),
})<{ full?: boolean }>`
  margin: 0;
  font-size: 2rem;
  line-height: 1.5;
  width: ${({ full }) => (full ? "100%" : "60%")};

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 100%;
    order: 1;
  }
`;

export const ImageWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
  }
`;

export const Image = styled.img`
  object-fit: cover;
  width: calc(100% / 3 - 2rem);
  aspect-ratio: 1/1;
  border-radius: 0.5rem;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    width: calc(100% / 2 - 2rem);
  }

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 100%;
  }
`;

export const FoodImage = styled.img`
  object-fit: cover;
  width: calc(40%);
  aspect-ratio: 1/1;
  border-radius: 0.5rem;

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
`;