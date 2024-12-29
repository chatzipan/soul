import styled from "styled-components";

import { Button, Fab, Tabs, Typography } from "@mui/material";

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ActionButton = styled(Button).withConfig({
  shouldForwardProp: (prop) => !["canceled", "isMobile"].includes(prop),
})<{ canceled?: boolean; isMobile?: boolean }>`
  display: ${({ isMobile, canceled }) =>
    isMobile && canceled ? "none" : "flex"};
  min-width: unset;
  align-items: center;
  padding: 0 !important;
  gap: 10px;
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const AddButton = styled(Fab)`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    margin-left: 0;
  }
`;

export const Header = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }
`;

export const List = styled.ul.withConfig({
  shouldForwardProp: (prop) => !["padded"].includes(prop),
})<{ padded?: boolean }>`
  margin: 0 0 20px 0;
  padding-left: ${({ padded }) => (padded ? "20px" : "0")};

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding-left: 0;
  }
`;

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 1.2rem;
  list-style: none;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export const ReservationList = styled.div`
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  padding-right: 10px;
  padding-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
    justify-content: center;
    max-height: calc(100vh - 420px);
  }
`;

export const ReservationListInner = styled.span`
  padding-left: 20px;
  display: block;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding-left: 0;
  }
`;

export const ReservationText = styled(Typography)`
  display: flex;
  width: 100%;
  align-items: flex-start;
  position: relative;
  gap: 10px;
  padding-right: 20px;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding-right: 10px;
    justify-content: space-between;
  }
`;

export const ReservationTextInner = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const ReservationTextBasic = styled.span.withConfig({
  shouldForwardProp: (prop) => !["canceled"].includes(prop),
})<{ canceled?: boolean }>`
  display: flex;
  text-decoration: ${({ canceled }) => (canceled ? "line-through" : "none")};
  align-items: center;
`;

export const ReservationContact = styled.span`
  margin-left: auto;
  display: flex;
  gap: 10px;
`;

export const ReservationLink = styled.a`
  display: flex;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

export const ReservationTime = styled.span`
  font-weight: bold;
  font-variant-numeric: tabular-nums;
`;

export const ReservationPersons = styled.span.withConfig({
  shouldForwardProp: (prop) => !["isMobile"].includes(prop),
})<{ isMobile?: boolean }>`
  font-variant-numeric: tabular-nums;
  align-items: center;
  display: ${({ isMobile }) => (isMobile ? "flex" : "inline")};
`;

export const TabBar = styled(Tabs)`
  margin-bottom: 20px;
`;
