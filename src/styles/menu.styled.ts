import Button from "../components/Button";
import styled from "styled-components";

export const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  max-width: 1248px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    max-width: 90vw;
    flex-direction: column;
  }

  &::before {
    content: "";
    position: fixed;
    width: 200%;
    height: 800%;
    top: -150%;
    left: 50%;
    z-index: -1;
    background: url(/svg/logo.svg) 0 0 repeat;
    background-size: 200px;
    transform: rotate(-30deg);
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
      top: -250%;
      display: none;
    }
  }
`;

export const HomeLink = styled(Button)`
  margin-top: auto;

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    margin-top: 0;
  }
`;

export const ScrollToTop = styled(Button)`
  margin: 3rem auto;
  display: block;
  padding: 0.5rem 1rem;

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    margin-top: 0;
  }
`;

export const Sidebar = styled.aside`
  position: sticky;
  top: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 6rem);
  width: 40%;
  backdrop-filter: blur(13px) saturate(70%);
  padding-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    position: static;
    width: auto;
    height: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 4.5rem;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    flex-direction: row;
    gap: 1rem;
    margin: 0 1rem;
    background-color: white;
    padding: 0;

    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Safari and Chrome */
    }
  }
`;

export const Category = styled.h3.withConfig({
  shouldForwardProp: (prop) => !["active"].includes(prop),
})<{ active: boolean }>`
  font-size: 1.75rem;
  font-family: "Cabin", sans-serif;
  line-height: 1.5;
  color: ${({ theme, active }) => (active ? theme.colors.primary : "#edd3c5")};
  margin: 0;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    display: inline-block;
    font-size: 1.5rem;
  }

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    &:not(:last-child)::after {
      content: " - ";
      display: inline-block;
      color: #edd3c5;
      font-weight: 100;
      margin-left: 1rem;
    }
  }
`;

export const SectionTitle = styled.h4`
  font-size: 2rem;
  font-family: "Cabin", sans-serif;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  text-transform: uppercase;
  text-align: center;
  display: block;
  backdrop-filter: blur(13px) saturate(70%);
  -webkit-backdrop-filter: blur(13px) saturate(70%);
  background-color: white;
  margin-top: -25px;
  display: inline-flex;
  padding: 0 5rem;

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    font-size: 1.5rem;
    margin-top: -20px;
  }
`;

export const Main = styled.div`
  width: 60%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 4rem 2rem;
  margin-left: auto;
  backdrop-filter: blur(13px) saturate(70%);
  -webkit-backdrop-filter: blur(13px) saturate(70%);

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    width: 100%;
    padding: 6rem 0 0;
  }
`;

export const Section = styled.section`
  margin-bottom: 3rem;
  padding: 1rem;
  border: 3px dashed ${({ theme }) => theme.colors.primaryLight};
  position: relative;
  text-align: center;
  padding-top: 0;
`;

export const Item = styled.p`
  margin: 0;
  font-size: 1.2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 1.5rem;
  text-transform: uppercase;

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemName = styled.span`
  font-family: "Cabin", sans-serif;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Price = styled.span`
  margin-top: 5px;
`;
