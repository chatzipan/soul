import { Link as GatsbyLink } from "gatsby";

import styled from "styled-components";

import Icon from "../../assets/logo.svg";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
    height: auto;
  }
`;

export const Text = styled.p`
  font-size: 2rem;
  line-height: 1.5;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    font-size: 1.75rem;
  }
`;

export const SubTitle = styled.p`
  font-size: 2rem;
  line-height: 1.5;
  font-family: "Josefin Sans", sans-serif;
  margin-bottom: 3rem;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    font-size: 1.5rem;
  }
`;

export const MenuButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
    width: 100%;
  }
`;

export const Hours = styled.p`
  font-size: 1.35rem;
  line-height: 1.5;
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  font-variant-numeric: tabular-nums;
  font-family: "Josefin Sans", sans-serif;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    font-size: 1rem;
  }
`;

export const InnerWrapper = styled.nav`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.secondary};
  transition: transform 0.3s ease-in-out;
  padding-top: 2rem;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    width: 100%;
  }
`;

export const Logo = styled(Icon)`
  width: 30vw;
  max-width: 700px;
  display: block;
  color: ${({ theme }) => theme.colors.secondary};
  fill: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 70vw;
    margin-bottom: 2rem;
  }
`;

export const Link = styled(GatsbyLink)`
  color: currentColor;
  text-decoration: none;
`;

export const ImageWrapper = styled.div`
  width: 50%;
  z-index: 1;
  flex-shrink: 0;
  border-radius: 0.5rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 100%;
  }
`;

export const TelLink = styled.a`
  color: inherit;
  font-family: "Josefin Sans", sans-serif;
  text-decoration-thickness: from-font;
  font-size: 1.35rem;
  line-height: 1.5;
  text-decoration: none;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    margin: 0.5rem 0;
    font-size: 1rem;
  }
`;

export const TelLinkUnderlined = styled.a`
  color: inherit;
  text-decoration-thickness: from-font;
  font-size: 1.35rem;
  line-height: 1.5;
  font-family: "Josefin Sans", sans-serif;
  text-decoration: underline;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    margin: 0.5rem 0;
    font-size: 1rem;
  }
`;

export const TextSmall = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 0;
  font-family: "Josefin Sans", sans-serif;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    font-size: 1rem;
  }
`;
