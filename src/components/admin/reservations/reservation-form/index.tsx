import { matchIsValidTel } from "mui-tel-input";
import React, { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { BasicInfo } from "./BasicInfo";
import { EventInfo } from "./EventInfo";
import { ContactInfo } from "./ContactInfo";

import { useEvents } from "../../../../hooks/useEvents";
import { useReservations } from "../../../../hooks/useReservations";

import {
  createReservation,
  updateReservation,
} from "../../../../services/reservations";
import { Reservation } from "../../../../types";
import { isValidEmail } from "../utils";

type ResponsiveDialogProps = {
  isEvent?: boolean;
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation;
};

const defaultData = {
  date: new Date().getTime(),
  disableParallelBookings: false,
  durationHours: undefined,
  email: "",
  eventInfo: "",
  eventTitle: "",
  firstName: "",
  isEvent: false,
  isOwnEvent: false,
  lastName: "",
  notes: "",
  persons: 0,
  telephone: "",
  time: "",
};

export const ReservationForm = ({
  isEvent = false,
  isOpen,
  onClose,
  reservation,
}: ResponsiveDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const queryClient = useQueryClient();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const isEditMode = Boolean(reservation);
  const addTitle = isEvent ? "Add Event" : "Add Reservation";
  const editTitle = isEvent ? "Edit Event" : "Edit Reservation";
  const title = isEditMode ? editTitle : addTitle;
  const submitText = isEditMode ? "Save Edit" : "Save";
  const [data, setData] = useState<Omit<Reservation, "id" | "canceled">>(
    reservation || { ...defaultData, isEvent }
  );

  const steps = [
    "basic",
    ...(isEvent ? ["event"] : []),
    ...(data.isOwnEvent ? [] : ["contact"]),
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const isEmailInvalid = data.email ? isValidEmail(data.email) : false;
  const isNextDisabled = isFirstStep
    ? !data.date || !data.persons || !data.time
    : !data.durationHours;

  const isTelephoneInvalid = data.telephone
    ? !matchIsValidTel(data.telephone)
    : false;

  const isSaveDisabled = data.isOwnEvent
    ? !data.eventTitle || !data.eventInfo || !data.durationHours
    : !data.firstName || isEmailInvalid || isTelephoneInvalid;

  const handleCloseSnackbar = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  const closeModal = () => {
    onClose();
    setTimeout(() => {
      if (isLastStep) {
        setCurrentStep(0);
      }

      setData({
        ...defaultData,
      });
    }, 500);
  };

  const mutation = useMutation({
    mutationFn: () => {
      const { date: _date, time, ...rest } = data;
      const date = new Date(_date);
      const timeArray = data.time.split(":");
      date.setHours(parseInt(timeArray[0]));
      date.setMinutes(parseInt(timeArray[1]));

      const _data = {
        ...rest,
        date: date.getTime(),
      };

      return isEditMode
        ? updateReservation(_data as Omit<Reservation, "time">)
        : createReservation({
            ..._data,
            canceled: false,
          });
    },

    onSuccess: () => {
      setShowSnackbar(true);
      queryClient.invalidateQueries({
        queryKey: isEvent ? useEvents.getKey() : useReservations.getKey(),
      });
      closeModal();
    },
  });

  useEffect(() => {
    if (reservation) {
      setData(reservation);
    } else {
      setData({
        ...defaultData,
        isEvent,
      });
    }
  }, [reservation, isEvent]);

  return (
    <>
      <Dialog
        fullScreen={isMobile}
        maxWidth='xl'
        open={isOpen}
        onClose={closeModal}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display:
                steps[currentStep] === "contact" || isMobile ? "block" : "flex",
              gap: 3,
            }}
          >
            {steps[currentStep] === "basic" && (
              <BasicInfo data={data} isEvent={isEvent} setData={setData} />
            )}
            {steps[currentStep] === "event" && (
              <EventInfo data={data} setData={setData} />
            )}
            {steps[currentStep] === "contact" && (
              <ContactInfo data={data} setData={setData} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Typography
            variant='caption'
            sx={{ color: "GrayText", mr: "auto", ml: 2 }}
          >
            * Required fields
          </Typography>
          <Button
            onClick={() =>
              isFirstStep ? closeModal() : setCurrentStep(currentStep - 1)
            }
          >
            {isFirstStep ? "Cancel" : "Back"}
          </Button>
          <Button
            color={isLastStep ? "success" : "primary"}
            disabled={isLastStep ? isSaveDisabled : isNextDisabled}
            onClick={() =>
              isLastStep ? mutation.mutate() : setCurrentStep(currentStep + 1)
            }
            variant='contained'
          >
            {isLastStep ? submitText : "Next"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity='success'
          variant='filled'
          sx={{ width: "100%" }}
        >
          Successfully Saved!
        </Alert>
      </Snackbar>
    </>
  );
};
