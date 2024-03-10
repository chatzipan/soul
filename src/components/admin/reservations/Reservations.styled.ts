import styled from "styled-components";

import { Fab, Tabs, Typography } from "@mui/material";

export const Actions = styled.div`
  display: flex;
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

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
  }
`;

export const ReservationList = styled.div`
  height: calc(100vh - 320px);
  overflow-y: auto;
  padding-right: 10px;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    flex-direction: column;
    justify-content: center;
    height: calc(100vh - 420px);
  }
`;

export const ReservationListInner = styled.div`
  padding-left: 20px;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    padding-left: 0;
  }
`;

export const ReservationText = styled(Typography)`
  display: flex;
  align-items: center;
  position: relative;
  gap: 10px;

  @media (max-width: ${({ theme }) => theme.sizes.tablet}) {
    justify-content: space-between;
  }
`;

export const TabBar = styled(Tabs)`
  margin-bottom: 20px;
`;
