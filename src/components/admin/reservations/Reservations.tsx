import React, { useEffect, useMemo, useRef, useState } from "react";
import { useToggle } from "react-use";

import AddIcon from "@mui/icons-material/Add";
import { Button, FormControlLabel, Switch, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Tab from "@mui/material/Tab";
import { RouteComponentProps } from "@reach/router";
import { isToday } from "date-fns";

import { Reservation } from "../../../../functions/src/types/reservation";
import { usePastReservations } from "../../../hooks/usePastReservations";
import { useReservations } from "../../../hooks/useReservations";
import { CancelModal } from "./CancelModal";
import { ReservationItem } from "./ReservationItem";
import * as S from "./Reservations.styled";
import { ReservationForm } from "./reservation-form";
import {
  TabsView,
  a11yProps,
  displayDate,
  groupByDateAndTime,
  monthNames,
} from "./utils";

const Reservations = (_: RouteComponentProps) => {
  const response = useReservations();
  const loading = response?.isFetching || response?.isLoading || !response;
  const listRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(TabsView.Upcoming);
  const [hideCanceled, setHideCanceled] = useState(true);
  const isTodayView = view === TabsView.Today;
  const [isCancelModalOpen, toggleCancelModal] = useToggle(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isAddReservationModalOpen, toggleAddReservationModal] =
    useToggle(false);

  const pastResponse = usePastReservations({
    enable: view === TabsView.Previous,
  });

  const reservations = (response?.data || []).filter((reservation) =>
    hideCanceled ? !reservation.canceled : true,
  ) as Reservation[];

  const pastReservations = (pastResponse?.data || []).filter((reservation) =>
    hideCanceled ? !reservation.canceled : true,
  ) as Reservation[];

  const handleViewChange = (_: React.SyntheticEvent, newValue: TabsView) => {
    setView(newValue);
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

  const hasTodayReservations = (reservations || []).some((reservation) =>
    isToday(new Date(reservation.date)),
  );

  const formatted = useMemo(() => {
    const _formatted = groupByDateAndTime(
      (reservations || []) as Reservation[],
      (pastReservations || []) as Reservation[],
      view,
    );

    const sortedGroupedByYear = Object.entries(_formatted).sort(
      (a, b) => parseInt(b[0]) - parseInt(a[0]),
    );

    return sortedGroupedByYear;
  }, [reservations, pastReservations, view]);

  useEffect(
    () => {
      if (hasTodayReservations) {
        setView(TabsView.Today);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasTodayReservations],
  );

  return (
    <S.Wrapper>
      <S.Header variant="h3" sx={{ mb: 2 }}>
        🍲 Reservations
        <S.AddButton
          color="primary"
          aria-label="add"
          variant="extended"
          sx={{ ml: { xs: 0, md: "auto" } }}
          onClick={toggleAddReservationModal}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add reservation
        </S.AddButton>
      </S.Header>
      <S.TabBar
        value={view}
        onChange={handleViewChange}
        sx={{ alignItems: "center", justifyContent: "center", display: "flex" }}
      >
        {hasTodayReservations && (
          <Tab
            label="Today"
            {...a11yProps(TabsView.Today)}
            disabled={!hasTodayReservations}
          />
        )}
        <Tab label="Upcoming" {...a11yProps(TabsView.Upcoming)} />
        <Tab label="Previous" {...a11yProps(TabsView.Previous)} />
        <FormControlLabel
          sx={{ ml: "auto", alignSelf: "center", justifySelf: "center" }}
          control={
            <Switch
              checked={hideCanceled}
              inputProps={{ "aria-label": "controlled" }}
              onChange={(e) => setHideCanceled(e.target.checked)}
            />
          }
          label="Hide canceled"
        />
      </S.TabBar>
      {loading && <CircularProgress sx={{ mt: 2, ml: "auto", mr: "auto" }} />}
      <S.ReservationList ref={listRef}>
        {formatted.map(([year, months]) => (
          <>
            {Object.entries(months).map(([month, days]) => (
              <div key={`${year}-${month}`}>
                {!isTodayView && (
                  <Typography variant="h5" sx={{ mb: 1 }} color="GrayText">
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
                          variant="h6"
                          color="GrayText"
                        >
                          {displayDate(
                            new Date(
                              `${year}-${monthIndex}-${day}T00:00:00.000Z`,
                            ),
                          )}
                        </Typography>
                      )}
                      <S.List padded={!isTodayView}>
                        {entries.map((r) => (
                          <ReservationItem
                            key={r.id}
                            isEvent={r.isEvent}
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
          </>
        ))}
      </S.ReservationList>
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={toggleCancelModal}
        reservation={selectedReservation as Reservation}
      />
      <ReservationForm
        isEvent={selectedReservation?.isEvent}
        isOpen={isAddReservationModalOpen}
        onClose={closeReservationModal}
        reservation={selectedReservation as Reservation}
      />
    </S.Wrapper>
  );
};

export default Reservations;
