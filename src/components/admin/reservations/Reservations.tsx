import { isBefore, isToday } from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useToggle } from "react-use";

import AddIcon from "@mui/icons-material/Add";
import CallIcon from "@mui/icons-material/Call";
import DomainVerificationSharpIcon from "@mui/icons-material/DomainVerificationSharp";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EmailIcon from "@mui/icons-material/Email";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
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

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Reservations = (_: RouteComponentProps) => {
  const response = useReservations();
  const reservations = response?.data as Reservation[];
  const loading = response?.isFetching || response?.isLoading || !response;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const listRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(TabsView.Upcoming);
  const isTodayView = view === TabsView.Today;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const [isCancelModalOpen, toggleCancelModal] = useToggle(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isAddReservationModalOpen, toggleAddReservationModal] =
    useToggle(false);

  const handleViewChange = (_: React.SyntheticEvent, newValue: TabsView) => {
    setView(newValue);
    // scroll to top
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeReservationModal = () => {
    setSelectedReservation(null);
    toggleAddReservationModal();
  };

  const handleTooltipClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setTooltipId(id);
  };

  const handleTooltipClose = () => {
    setAnchorEl(null);
    setTooltipId(null);
  };

  const openCancelModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    toggleCancelModal();
  };

  const openEditModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    toggleAddReservationModal();
  };

  const hasTodayReservations = (reservations || []).some((reservation) =>
    isToday(new Date(reservation.date))
  );

  const formatted = useMemo(
    () => groupByDateAndTime((reservations || []) as Reservation[], view),
    [reservations, view]
  );

  useEffect(
    () => {
      if (hasTodayReservations) {
        setView(TabsView.Today);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasTodayReservations]
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
          <Tab
            label='Today'
            {...a11yProps(TabsView.Today)}
            disabled={!hasTodayReservations}
          />
        )}
        <Tab label='Upcoming' {...a11yProps(TabsView.Upcoming)} />
        <Tab label='Previous' {...a11yProps(TabsView.Previous)} />
      </S.TabBar>
      {loading && <CircularProgress sx={{ mt: 2, ml: "auto", mr: "auto" }} />}
      {Object.entries(formatted).map(([year, months]) => (
        <S.ReservationList key={year} ref={listRef}>
          {Object.entries(months).map(([month, days]) => (
            <div key={`${year}-${month}`}>
              {!isTodayView && (
                <Typography variant='h5' sx={{ mb: 1 }} color='GrayText'>
                  {month} {year}
                </Typography>
              )}
              {Object.entries(days).map(([_day, entries]) => {
                const monthIndex = (monthNames.indexOf(month) + 1)
                  .toString()
                  .padStart(2, "0");
                const day = _day.padStart(2, "0");

                return (
                  <S.ReservationListInner key={`${year}-${month}-${day}`}>
                    {!isTodayView && (
                      <Typography sx={{ mb: 1 }} variant='h6' color='GrayText'>
                        {displayDate(
                          new Date(`${year}-${monthIndex}-${day}T00:00:00.000Z`)
                        )}
                      </Typography>
                    )}
                    <S.List padded={!isTodayView}>
                      {entries.map((r) => {
                        const { email, firstName, lastName, time, telephone } =
                          r;
                        const _lastName =
                          lastName && !isSmallMobile ? ` ${lastName}` : "";
                        const fullName = `${firstName}${_lastName}`;
                        const hasContact = email || telephone;
                        const hasEmail = email ? 1 : 0;
                        const hasTelephone = telephone ? 1 : 0;
                        const hasNotes = r.notes ? 1 : 0;
                        const actionNumbers =
                          hasEmail + hasTelephone + hasNotes;
                        const isBeforeToday = isBefore(
                          new Date(r.date).setHours(0, 0, 0, 0),
                          new Date().setHours(0, 0, 0, 0)
                        );

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
                                      {r.persons}&nbsp;{!isMobile && "persons"}
                                      {isSmallMobile && "P"}
                                    </>
                                  </S.ReservationPersons>
                                  &nbsp;&#183;&nbsp;
                                  <Typography
                                    noWrap
                                    // ellipsis
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      fontSize: "inherit",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: `calc(20vw - ${actionNumbers} * 2vw)`,
                                    }}
                                    title={fullName}
                                  >
                                    {fullName}
                                  </Typography>
                                  {r.notes && (
                                    <Button
                                      onClick={(e) =>
                                        handleTooltipClick(e, r.id)
                                      }
                                      sx={{
                                        p: 0,
                                        ml: 1,
                                        mr: 1,
                                        minWidth: 0,
                                      }}
                                    >
                                      <InfoOutlinedIcon
                                        sx={{ cursor: "pointer" }}
                                      />
                                    </Button>
                                  )}
                                  <Popover
                                    open={tooltipId === r.id}
                                    anchorEl={anchorEl}
                                    onClose={handleTooltipClose}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                  >
                                    <Typography sx={{ p: 2 }}>
                                      {r.notes}
                                    </Typography>
                                  </Popover>
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
                                        target='_blank'
                                      >
                                        {isMobile ? <CallIcon /> : telephone}
                                      </S.ReservationLink>
                                    )}
                                    {email && (
                                      <S.ReservationLink
                                        href={`mailto:${email}`}
                                        target='_blank'
                                      >
                                        {isMobile ? <EmailIcon /> : email}
                                      </S.ReservationLink>
                                    )}
                                  </S.ReservationContact>
                                )}
                              </S.ReservationTextInner>
                            </S.ReservationText>
                            <S.Actions>
                              {/* <Button disabled={reservation.canceled}>Edit</Button> */}
                              <S.ActionButton
                                isSmallMobile={isSmallMobile}
                                isMobile={isMobile}
                                canceled={r.canceled}
                                onClick={() => openEditModal(r)}
                                disabled={r.canceled || isBeforeToday}
                              >
                                {isSmallMobile ? <EditCalendarIcon /> : "Edit"}
                              </S.ActionButton>
                              <S.ActionButton
                                color='error'
                                isSmallMobile={isSmallMobile}
                                isMobile={isMobile}
                                canceled={r.canceled}
                                onClick={() => openCancelModal(r)}
                                disabled={r.canceled || isBeforeToday}
                                sx={{ mt: { xs: 0.25, sm: 0 } }}
                              >
                                {isSmallMobile ? <EventBusyIcon /> : "Cancel"}
                              </S.ActionButton>
                            </S.Actions>
                          </S.ListItem>
                        );
                      })}
                    </S.List>
                  </S.ReservationListInner>
                );
              })}
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
        onClose={closeReservationModal}
        reservation={selectedReservation as Reservation}
      />
    </S.Wrapper>
  );
};

export default Reservations;
