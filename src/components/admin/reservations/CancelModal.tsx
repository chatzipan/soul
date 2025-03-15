import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Reservation } from "../../../../functions/src/types/reservation";
import { useReservations } from "../../../hooks/useReservations";
import { updateReservation } from "../../../services/reservations";

type ResponsiveDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
};

export const CancelModal = ({
  isOpen,
  onClose,
  reservation,
}: ResponsiveDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const queryClient = useQueryClient();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCloseSnackbar = (
    _?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  const mutation = useMutation({
    mutationFn: () =>
      updateReservation({
        ...reservation,
        canceled: true,
      }),
    onSuccess: () => {
      setShowSnackbar(true);
      queryClient.invalidateQueries({ queryKey: useReservations.getKey() });
      onClose();
    },
  });

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={isOpen}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Cancel Reservation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this reservation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose}>
            Nope, keep it
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            autoFocus
            color="error"
          >
            Yes, cancel it
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Successfully canceled reservation!
        </Alert>
      </Snackbar>
    </>
  );
};
