import { isToday } from "date-fns";
import { is } from "date-fns/locale";
import React, { useMemo, useRef, useState } from "react";
import { useToggle } from "react-use";

import AddIcon from "@mui/icons-material/Add";
import CallIcon from "@mui/icons-material/Call";
import CancelIcon from "@mui/icons-material/Cancel";
import DomainVerificationSharpIcon from "@mui/icons-material/DomainVerificationSharp";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { RouteComponentProps } from "@reach/router";

import { useReservations } from "../../../hooks/useReservations";
import { Reservation } from "../../../types";
import { AddReservationModal } from "./AddReservationModal";
import { CancelModal } from "./CancelModal";
import * as S from "./Reservations.styled";
import { TabsView, a11yProps, displayDate, groupByDateAndTime } from "./utils";

const Reservations = (_: RouteComponentProps) => {
  const response = useReservations();
  const reservations = response?.data as Reservation[];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const listRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(TabsView.Today);
  const isTodayView = view === TabsView.Today;
  const [isCancelModalOpen, toggleCancelModal] = useToggle(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isAddReservationModalOpen, toggleAddReservationModal] =
    useToggle(false);

  const handleViewChange = (_: React.SyntheticEvent, newValue: number) => {
    setView(newValue);
    // scroll to top
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCancelModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    toggleCancelModal();
  };
  const hasTodayReservations = (reservations || []).some((reservation) =>
    isToday(new Date(reservation.date))
  );

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
          sx={{ ml: { xs: 0, md: "auto" } }}
          onClick={toggleAddReservationModal}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add reservation
        </S.AddButton>
      </S.Header>
      <S.TabBar value={view} onChange={handleViewChange}>
        {hasTodayReservations && (
          <Tab label='Today' {...a11yProps(TabsView.Today)} />
        )}
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
                    {entries.map((r) => {
                      const { email, firstName, lastName, time, telephone } = r;
                      const _lastName =
                        lastName && !isSmallMobile ? ` ${lastName}` : "";
                      const fullName = `${firstName}${_lastName}`;
                      const hasContact = email || telephone;

                      return (
                        <S.ListItem key={r.id}>
                          <S.ReservationText sx={{ fontSize: 20 }}>
                            <S.ReservationTextInner>
                              <S.ReservationTextBasic canceled={r.canceled}>
                                <S.ReservationTime>{time}</S.ReservationTime>
                                &nbsp;&#183;&nbsp;
                                <S.ReservationPersons isMobile={isMobile}>
                                  <>
                                    <GroupsIcon
                                      sx={{
                                        mr: 1,
                                        display:
                                          isMobile && !isSmallMobile
                                            ? "block"
                                            : "none",
                                      }}
                                    />
                                    {r.persons}
                                    {!isMobile && " persons"}
                                    {isSmallMobile && "P"}
                                  </>
                                </S.ReservationPersons>
                                &nbsp;&#183;&nbsp;
                                {fullName}
                              </S.ReservationTextBasic>
                              {r.canceled && (
                                <Chip
                                  label='Canceled'
                                  color='error'
                                  variant='outlined'
                                  size='small'
                                  component='span'
                                  sx={{ ml: 1 }}
                                />
                              )}
                              {hasContact && (
                                <S.ReservationContact>
                                  {telephone && (
                                    <S.ReservationLink
                                      href={`tel:${telephone}`}
                                    >
                                      {isMobile ? <CallIcon /> : telephone}
                                    </S.ReservationLink>
                                  )}
                                  {email && (
                                    <S.ReservationLink href={`mailto:${email}`}>
                                      {isMobile ? <EmailIcon /> : email}
                                    </S.ReservationLink>
                                  )}
                                </S.ReservationContact>
                              )}
                            </S.ReservationTextInner>
                          </S.ReservationText>
                          <S.Actions>
                            {/* <Button disabled={reservation.canceled}>Edit</Button> */}
                            <Button
                              color='error'
                              sx={{
                                p: 0,
                                minWidth: isSmallMobile ? "auto" : "unset",
                                display:
                                  isMobile && r.canceled ? "none" : "flex",
                              }}
                              onClick={() => openCancelModal(r)}
                              disabled={r.canceled}
                            >
                              {isSmallMobile ? <CancelIcon /> : "Cancel"}
                            </Button>
                          </S.Actions>
                        </S.ListItem>
                      );
                    })}
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
      <AddReservationModal
        isOpen={isAddReservationModalOpen}
        onClose={toggleAddReservationModal}
      />
    </S.Wrapper>
  );
};

export default Reservations;
