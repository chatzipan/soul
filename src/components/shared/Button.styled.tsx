import { Link as GatsbyLink } from "gatsby";

import styled, { css } from "styled-components";

const commonStyles = css<{ small?: boolean; reverse?: boolean }>`
  background-color: ${({ theme, reverse }) =>
    reverse ? theme.colors.secondary : theme.colors.primary};
  color: ${({ theme, reverse }) =>
    reverse ? theme.colors.primary : theme.colors.secondary} !important;
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

export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !["small", "reverse"].includes(prop),
})<{ small?: boolean; reverse?: boolean }>`
  ${commonStyles}
`;

export const Link = styled(GatsbyLink).withConfig({
  shouldForwardProp: (prop) => !["small", "reverse"].includes(prop),
})<{ small?: boolean; reverse?: boolean }>`
  ${commonStyles}
  text-decoration: none;
`;

export const NativeLink = styled.a.withConfig({
  shouldForwardProp: (prop) => !["small", "reverse"].includes(prop),
})<{ small?: boolean; reverse?: boolean }>`
  ${commonStyles}
  text-decoration: none;
`;
