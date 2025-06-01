import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

import type { PageProps } from "gatsby";
import { navigate } from "gatsby";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, isPast } from "date-fns";
import de from "date-fns/locale/de";

import { Reservation } from "../../../../functions/src/types/reservation";
import { BookingForm } from "../../../components/booking-form/BookingForm";
import { useReservationById } from "../../../hooks/useReservationById";

const EditReservationPage: React.FC<{ id: string }> = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [updatedReservation, setUpdatedReservation] =
    useState<Reservation | null>(null);

  const {
    data: reservation,
    isLoading,
    isFetching,
    isFetched,
    error,
    errorMessage,
  } = useReservationById(id);

  const isReservationPast = isPast(new Date(reservation?.date || ""));

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  if (isLoading || isFetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (
    error ||
    (isFetched && !reservation) ||
    reservation?.canceled ||
    isReservationPast
  ) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {isReservationPast
            ? "This reservation has already passed and cannot be edited."
            : reservation?.canceled
              ? "This reservation has already been canceled and cannot be edited."
              : errorMessage ||
                "Failed to load reservation details. Please try again later."}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  if (!reservation) {
    return null;
  }

  return (
    <Box p={3} maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Edit Reservation
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Reservation Details
          </Typography>
          <Typography>
            <strong>Name:</strong> {reservation?.firstName}&nbsp;
            {reservation?.lastName}
          </Typography>
          <Typography>
            <strong>Date:</strong>&nbsp;
            {format(new Date(reservation?.date || ""), "MMMM d, yyyy")}
          </Typography>
          <Typography>
            <strong>Time:</strong> {reservation?.time}
          </Typography>
          <Typography>
            <strong>Number of Persons:</strong> {reservation?.persons}
          </Typography>
        </CardContent>
      </Card>

      {updatedReservation && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Updated Reservation Details
            </Typography>
            <Typography>
              <strong>Name:</strong> {updatedReservation?.firstName}&nbsp;
              {updatedReservation?.lastName}
            </Typography>
            <Typography>
              <strong>Date:</strong>&nbsp;
              {format(new Date(updatedReservation?.date || ""), "MMMM d, yyyy")}
            </Typography>
            <Typography>
              <strong>Time:</strong> {updatedReservation?.time}
            </Typography>
            <Typography>
              <strong>Number of Persons:</strong> {updatedReservation?.persons}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {!updatedReservation && (
            <Typography variant="h6">New Reservation Details</Typography>
          )}
          <BookingForm
            isOpen={isModalOpen}
            initialReservation={reservation}
            onClose={handleCloseModal}
            selectedDate={new Date(reservation.date)}
            onSuccess={setUpdatedReservation}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

const EditReservationPageWrapper: React.FC<PageProps> = (props) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({}),
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <EditReservationPage id={props.params.id} />
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default EditReservationPageWrapper;
