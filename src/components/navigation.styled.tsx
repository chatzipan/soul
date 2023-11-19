import { Link as GatsbyLink } from "gatsby";
import Icon from "../assets/logo.svg";
import styled from "styled-components";

export const Nav = styled.nav.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  width: calc((1 / 3) * 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  position: fixed;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.3s ease-in-out;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
    width: 100%;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 4rem;
  height: 4rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 1;
  color: white;

  @media (min-width: ${({ theme }) => theme.sizes.laptopL}) {
    display: none;
  }
`;

export const MenuButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 4rem;
  height: 4rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 2;
  color: ${({ theme }) => theme.colors.secondary};

  @media (min-width: ${({ theme }) => theme.sizes.laptopL}) {
    display: none;
  }
`;

export const Logo = styled(Icon)`
  width: 20vw;
  max-width: 700px;
  margin: 0 auto;
  display: block;
  color: white;
  fill: white;
  margin-bottom: 4rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    width: 70vw;
  }

  @media (max-width: ${({ theme }) => theme.sizes.laptopL}) {
    width: 70vw;
  }
`;

export const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  font-size: 2rem;
  font-weight: bold;
  margin: 2rem 0;
`;

export const Link = styled(GatsbyLink)`
  color: currentColor;
  text-decoration: none;
`;

export const Circles = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  z-index: -1;
`;

export const Circle = styled.li`
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: ${({ theme }) => theme.colors.primaryLight};
  animation: animate 25s linear infinite;
  bottom: -150px;

  &:nth-child(1) {
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
  }

  &:nth-child(3) {
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
  }

  &:nth-child(4) {
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
  }

  &:nth-child(5) {
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
  }

  &:nth-child(6) {
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
  }

  &:nth-child(7) {
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
  }

  &:nth-child(8) {
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
  }

  &:nth-child(9) {
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
  }

  &:nth-child(10) {
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
  }

  @keyframes animate {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
      border-radius: 0;
    }

    100% {
      transform: translateY(-1000px) rotate(720deg);
      opacity: 0;
      border-radius: 50%;
    }
  }
`;
