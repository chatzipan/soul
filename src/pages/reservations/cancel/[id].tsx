import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import de from "date-fns/locale/de";

import { useReservationById } from "../../../hooks/useReservationById";
import { cancelReservation } from "../../../services/reservations";

const CancelReservationPage: React.FC<{ id: string }> = ({ id }) => {
  const queryClient = useQueryClient();

  const {
    // @ts-ignore
    data: reservation,
    // @ts-ignore
    isLoading,
    // @ts-ignore
    error,
  } = useReservationById(id, { enable: true });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const cancelMutation = useMutation({
    mutationFn: () => cancelReservation(id || ""),
    onSuccess: () => {
      setCancelSuccess(true);
      setCancelDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: useReservationById.getKey(id),
      });
    },
  });

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    cancelMutation.mutate();
  };

  const handleCloseDialog = () => {
    setCancelDialogOpen(false);
  };

  if (isLoading) {
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

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load reservation details. Please try again later.
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
    return (
      <Box p={3}>
        <Alert severity="warning">Reservation not found</Alert>
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

  // If reservation is already canceled
  if (reservation.canceled) {
    return (
      <Box p={3}>
        <Alert severity="info">
          This reservation has already been canceled.
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

  // Format date and time
  const formattedDate = format(new Date(reservation.date), "MMMM d, yyyy");
  const formattedTime = reservation.time;

  return (
    <Box p={3} maxWidth="600px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Cancel Reservation
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reservation Details
          </Typography>
          <Typography>
            <strong>Name:</strong> {reservation.firstName}{" "}
            {reservation.lastName}
          </Typography>
          <Typography>
            <strong>Date:</strong> {formattedDate}
          </Typography>
          <Typography>
            <strong>Time:</strong> {formattedTime}
          </Typography>
          <Typography>
            <strong>Number of Persons:</strong> {reservation.persons}
          </Typography>
          {reservation.notes && (
            <Typography>
              <strong>Notes:</strong> {reservation.notes}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Typography variant="body1" paragraph>
        Are you sure you want to cancel this reservation?
      </Typography>

      <Box display="flex" gap={2}>
        <Button variant="contained" color="error" onClick={handleCancelClick}>
          Yes, Cancel Reservation
        </Button>
        <Button variant="outlined" onClick={() => navigate("/")}>
          No, Keep Reservation
        </Button>
      </Box>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your reservation for {formattedDate}{" "}
            at {formattedTime}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={cancelMutation.isPending}
          >
            No, Keep Reservation
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            autoFocus
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              "Yes, Cancel Reservation"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message */}
      {cancelSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Your reservation has been successfully canceled.
        </Alert>
      )}
    </Box>
  );
};

const CancelReservationPageWrapper: React.FC<PageProps> = (props) => {
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
        <CancelReservationPage id={props.params.id} />
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default CancelReservationPageWrapper;
