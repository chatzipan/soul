import styled, { css } from "styled-components";

import { Link as GatsbyLink } from "gatsby";

const commonStyles = css`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  font-family: sans-serif;
  letter-spacing: 0.2cap;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Button = styled.button`
  ${commonStyles}
`;

export const Link = styled(GatsbyLink)`
  ${commonStyles}
  text-decoration: none;
`;
