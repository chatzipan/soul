import Button from "../../components/shared/Button";
import styled from "styled-components";
import { Link } from "@reach/router";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  max-width: 1248px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 0;
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
    }
  }
`;

export const HomeLink = styled(Button)`
  margin-top: 2rem;
  display: block;
`;

export const Category = styled(Link)`
  font-size: 2.5rem;
  font-family: "Cabin", sans-serif;
  line-height: 1.5;
  color: #e8a886;
  margin: 0;
  cursor: pointer;
  backdrop-filter: blur(13px) saturate(70%);
  -webkit-backdrop-filter: blur(13px) saturate(70%);
  padding: 0 5rem;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    display: inline-block;
    padding: 0 1rem;
    font-size: 2rem;
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
  display: inline-flex;
  padding: 1rem;

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    font-size: 1.5rem;
  }
`;

export const Main = styled.div`
  width: 60%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 4rem 2rem;
  margin: 0 auto;
  backdrop-filter: blur(13px) saturate(70%);
  -webkit-backdrop-filter: blur(13px) saturate(70%);
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    width: 90%;
    padding: 4rem 0;
  }
`;

export const Section = styled.section`
  margin-bottom: 8rem;
  padding: 1rem 1rem 2rem;
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
  text-align: left;
`;

export const Price = styled.span`
  margin-top: 5px;
`;
