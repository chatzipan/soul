import { isToday } from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useToggle } from "react-use";

import AddIcon from "@mui/icons-material/Add";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Tab from "@mui/material/Tab";
import { RouteComponentProps } from "@reach/router";

import { useEvents } from "../../../hooks/useEvents";
import { Reservation } from "../../../../functions/src/types/reservation";
import { ReservationForm } from "./reservation-form";
import { ReservationItem } from "./ReservationItem";
import { CancelModal } from "./CancelModal";
import * as S from "./Reservations.styled";
import {
  TabsView,
  a11yProps,
  displayDate,
  groupByDateAndTime,
  monthNames,
} from "./utils";

const Events = (_: RouteComponentProps) => {
  const response = useEvents();
  const events = response?.data as Reservation[];
  const loading = response?.isFetching || response?.isLoading || !response;
  const listRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(TabsView.Upcoming);
  const isTodayView = view === TabsView.Today;
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

  const openCancelModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    toggleCancelModal();
  };

  const openEditModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    toggleAddReservationModal();
  };

  const hasTodayReservations = (events || []).some((event) =>
    isToday(new Date(event.date))
  );

  const formatted = useMemo(
    () => groupByDateAndTime((events || []) as Reservation[], view),
    [events, view]
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
        🍷 Events
        <S.AddButton
          color='primary'
          aria-label='add'
          variant='extended'
          sx={{ ml: { xs: 0, md: "auto" } }}
          onClick={toggleAddReservationModal}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add event
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
      {Object.keys(formatted).length === 0 ? (
        <Typography>No events created yet</Typography>
      ) : (
        Object.entries(formatted).map(([year, months]) => (
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
                        <Typography
                          sx={{ mb: 1 }}
                          variant='h6'
                          color='GrayText'
                        >
                          {displayDate(
                            new Date(
                              `${year}-${monthIndex}-${day}T00:00:00.000Z`
                            )
                          )}
                        </Typography>
                      )}
                      <S.List padded={!isTodayView}>
                        {entries.map((r) => (
                          <ReservationItem
                            key={r.id}
                            reservation={r}
                            openCancelModal={openCancelModal}
                            openEditModal={openEditModal}
                          />
                        ))}
                      </S.List>
                    </S.ReservationListInner>
                  );
                })}
              </div>
            ))}
          </S.ReservationList>
        ))
      )}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={toggleCancelModal}
        reservation={selectedReservation as Reservation}
      />
      <ReservationForm
        isEvent
        isOpen={isAddReservationModalOpen}
        onClose={closeReservationModal}
        reservation={selectedReservation as Reservation}
      />
    </S.Wrapper>
  );
};

export default Events;
