import Button from "../../components/shared/Button";
import styled from "styled-components";
import { Link } from "@reach/router";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0;
  background-color: #1b4235;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding: 0;
  }
`;

export const HomeLink = styled(Button)`
  margin-top: 2rem;
  display: block;
`;

export const Category = styled(Link)`
  font-size: 3.5rem;
  color: #f5c469;
  font-family: "Adrianna Extended Thin";
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  margin: 0;
  cursor: pointer;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  padding: 20px 0 5px;
  text-transform: uppercase;
  border: 2px solid;
  width: 50vw;
  text-align: center;
  margin-bottom: 1rem;
  text-decoration: none;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    display: inline-block;
    padding: 1.25rem 0 1rem;
    font-size: 2.5rem;
    width: 80vw;
  }
`;

export const SectionTitle = styled.h4`
  font-size: 2.5rem;
  font-family: "Josefin Sans", sans-serif;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
  text-transform: uppercase;
  text-align: center;
  display: block;
  padding: 1rem;

  @media (max-width: ${({ theme }) => theme.sizes.laptop}) {
    font-size: 1.5rem;
  }
`;

export const SectionSubTitle = styled.h4`
  font-size: 1.5rem;
  font-family: "Josefin Sans", sans-serif;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
  text-transform: uppercase;
  text-align: center;
  display: block;
  display: inline-flex;
  padding-top: 2rem;

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
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
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
  padding: 1rem 1rem 0;
  border: 3px dashed ${({ theme }) => theme.colors.secondary};
  position: relative;
  text-align: center;
  padding-top: 0;
`;

export const Item = styled.p`
  margin: 0;
  font-size: 1.2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1.5rem;
  text-transform: uppercase;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

export const ItemDescription = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  text-transform: lowercase;

  & p {
    margin: 0;
  }

  & ul {
    text-align: left;
    padding-left: 1rem;
  }

  & li {
    margin-bottom: 0.5rem;
    text-transform: capitalize;
    line-height: 1.5;
  }
`;

export const Price = styled.span`
  font-family: "Josefin Sans", sans-serif;

  margin-top: 5px;
  color: ${({ theme }) => theme.colors.secondary};
`;
