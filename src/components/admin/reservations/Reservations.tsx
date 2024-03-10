import React, { useMemo, useRef, useState } from "react";
import { useToggle } from "react-use";

import AddIcon from "@mui/icons-material/Add";
import DomainVerificationSharpIcon from "@mui/icons-material/DomainVerificationSharp";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { RouteComponentProps } from "@reach/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useReservations } from "../../../hooks/useReservations";
import { createReservation } from "../../../services/reservations";
import { Reservation } from "../../../types";
import { CancelModal } from "./CancelModal";
import * as S from "./Reservations.styled";
import { TabsView, a11yProps, displayDate, groupByDateAndTime } from "./utils";

const renderReservation = (reservation: Reservation, isMobile: boolean) => `
  ${reservation.time} - ${reservation.persons} ${
  isMobile ? "PAX" : "Persons"
} - ${reservation.name}`;

const Reservations = (_: RouteComponentProps) => {
  const response = useReservations();
  const reservations = response?.data;
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const listRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(TabsView.Today);
  const isTodayView = view === TabsView.Today;
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isCancelModalOpen, toggleCancelModal] = useToggle(false);

  const handleViewChange = (event: React.SyntheticEvent, newValue: number) => {
    setView(newValue);
    // scroll to top
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCancelModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    toggleCancelModal();
  };

  const mutation = useMutation({
    mutationFn: () =>
      createReservation({
        canceled: false,
        name: Math.random().toString(36).substring(7),
        date: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          Math.floor(Math.random() * 31)
        ).toISOString(),
        // random time from 9:00 to 21:00
        time: `${Math.floor(Math.random() * 12) + 9}:00`,
        persons: Math.floor(Math.random() * 6),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useReservations.getKey() });
    },
  });

  const formatted = useMemo(
    () => groupByDateAndTime((reservations || []) as Reservation[], view),
    [reservations, view]
  );

  return (
    <S.Wrapper>
      <S.Header variant='h3' sx={{ mb: 2 }}>
        <DomainVerificationSharpIcon sx={{ fontSize: 60, color: "green" }} />
        Reservations
        <S.AddButton
          color='primary'
          aria-label='add'
          variant='extended'
          sx={{ ml: { sm: 0, md: "auto" } }}
          onClick={() => mutation.mutate()}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add reservation
        </S.AddButton>
      </S.Header>
      <S.TabBar value={view} onChange={handleViewChange}>
        <Tab label='Today' {...a11yProps(TabsView.Today)} />
        <Tab label='Upcoming' {...a11yProps(TabsView.Upcoming)} />
        <Tab label='Previous' {...a11yProps(TabsView.Previous)} />
      </S.TabBar>
      {Object.entries(formatted).map(([year, months]) => (
        <S.ReservationList key={year} ref={listRef}>
          {Object.entries(months).map(([month, days]) => (
            <div key={`${year}-${month}`}>
              {!isTodayView && (
                <Typography variant='h5' sx={{ mb: 1 }} color='GrayText'>
                  {month} {year}
                </Typography>
              )}
              {Object.entries(days).map(([day, entries]) => (
                <S.ReservationListInner key={`${year}-${month}-${day}`}>
                  {!isTodayView && (
                    <Typography sx={{ mb: 1 }} variant='h6' color='GrayText'>
                      {displayDate(new Date(`${year}-${month}-${day}`))}
                    </Typography>
                  )}
                  <S.List padded={!isTodayView}>
                    {entries.map((reservation) => (
                      <S.ListItem key={reservation.id}>
                        <S.ReservationText
                          sx={{
                            fontSize: 20,
                          }}
                        >
                          <Box
                            component='span'
                            sx={{
                              textDecoration: reservation.canceled
                                ? "line-through"
                                : "",
                            }}
                          >
                            {renderReservation(reservation, isMobile)}
                          </Box>
                          {reservation.canceled && (
                            <Chip
                              label='Canceled'
                              color='error'
                              variant='outlined'
                              size='small'
                              component='span'
                            />
                          )}
                        </S.ReservationText>
                        <S.Actions>
                          <Button disabled={reservation.canceled}>Edit</Button>
                          <Button
                            color='error'
                            onClick={() => openCancelModal(reservation)}
                            disabled={reservation.canceled}
                          >
                            Cancel
                          </Button>
                        </S.Actions>
                      </S.ListItem>
                    ))}
                  </S.List>
                </S.ReservationListInner>
              ))}
            </div>
          ))}
        </S.ReservationList>
      ))}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={toggleCancelModal}
        reservation={selectedReservation as Reservation}
      />
    </S.Wrapper>
  );
};

export default Reservations;
