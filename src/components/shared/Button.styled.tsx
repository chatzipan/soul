import styled, { css } from "styled-components";

import { Link as GatsbyLink } from "gatsby";

const commonStyles = css<{ small?: boolean }>`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  padding: ${({ small }) => (small ? "0.5rem 1rem" : "1rem 2rem")};
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  font-family: sans-serif;
  letter-spacing: 0.2cap;
  text-align: center;
`;

export const Button = styled.button<{ small?: boolean }>`
  ${commonStyles}
`;

export const Link = styled(GatsbyLink)<{ small?: boolean }>`
  ${commonStyles}
  text-decoration: none;
`;

export const NativeLink = styled.a<{ small?: boolean }>`
  ${commonStyles}
  text-decoration: none;
`;
