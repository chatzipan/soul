import { parseISO } from "date-fns";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useReservations } from "../../../hooks/useReservations";
import {
  createReservation,
  updateReservation,
} from "../../../services/reservations";
import { Reservation } from "../../../types";
import { isValidEmail } from "./utils";

type ResponsiveDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation;
};

const createTimeOptions = () => {
  // create options every 15 minutes
  const options = [];
  for (let i = 9; i < 21; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hours = `${i}`.padStart(2, "0");
      const minutes = `${j}`.padEnd(2, "0");
      options.push(`${hours}:${minutes}`);
    }
  }
  return options;
};

const inputStyle = {
  minWidth: {
    xs: "100%",
    md: 320,
  },
  mb: 3,
};

const defaultData = {
  date: "",
  persons: 0,
  time: "",
  firstName: "",
  lastName: "",
  notes: "",
  email: "",
  telephone: "",
};

export const AddReservationModal = ({
  isOpen,
  onClose,
  reservation,
}: ResponsiveDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const queryClient = useQueryClient();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const isEditMode = Boolean(reservation);
  const title = isEditMode ? "Edit Reservation" : "Add Reservation";
  const submitText = isEditMode ? "Save Edit" : "Save";
  const [data, setData] = useState<Omit<Reservation, "id" | "canceled">>(
    reservation || defaultData
  );

  const [isLastStep, toggleIsLastStep] = useToggle(false);
  const isNextDisabled = !data.date || !data.persons || !data.time;
  const isEmailInvalid = data.email ? isValidEmail(data.email) : false;
  const isTelephoneInvalid = data.telephone
    ? !matchIsValidTel(data.telephone)
    : false;

  const isSaveDisabled =
    !data.firstName || isEmailInvalid || isTelephoneInvalid;

  const handleCloseSnackbar = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  const handlePersonsChange = (event: SelectChangeEvent) => {
    setData({ ...data, persons: parseInt(event.target.value) });
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    setData({ ...data, time: event.target.value });
  };

  const closeModal = () => {
    onClose();
    setTimeout(() => {
      if (isLastStep) {
        toggleIsLastStep();
      }

      setData({
        ...defaultData,
      });
    }, 500);
  };

  const mutation = useMutation({
    mutationFn: () =>
      isEditMode
        ? updateReservation(data as Reservation)
        : createReservation({
            ...data,
            canceled: false,
          }),
    onSuccess: () => {
      setShowSnackbar(true);
      queryClient.invalidateQueries({ queryKey: useReservations.getKey() });
      closeModal();
    },
  });

  useEffect(() => {
    if (reservation) {
      setData(reservation);
    } else {
      setData({
        ...defaultData,
      });
    }
  }, [reservation]);

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
            sx={{ display: isLastStep || isMobile ? "block" : "flex", gap: 3 }}
          >
            {!isLastStep ? (
              <>
                <div>
                  <Typography variant='h6' gutterBottom>
                    Select Date
                  </Typography>
                  <DateCalendar
                    disablePast
                    maxDate={new Date("2024-12-31")}
                    onChange={(newDate) => {
                      setData({
                        ...data,
                        date: newDate.toISOString(),
                      });
                    }}
                    timezone='Europe/Zurich'
                    value={data.date ? parseISO(data.date) : null}
                  />
                </div>
                <div>
                  <Typography variant='h6' gutterBottom sx={{ mb: 3 }}>
                    Select Persons
                  </Typography>
                  <FormControl fullWidth sx={{ mb: isMobile ? 2 : 11 }}>
                    <InputLabel id='demo-simple-select-label'>
                      Persons
                    </InputLabel>
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={data.persons ? data.persons.toString() : ""}
                      sx={{ minWidth: 320 }}
                      label='Persons'
                      onChange={handlePersonsChange}
                    >
                      {Array.from(Array(40).keys()).map((p) => (
                        <MenuItem key={p} value={p + 1}>
                          {p + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant='h6' gutterBottom sx={{ mb: 3 }}>
                    Select Time
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>Time</InputLabel>
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={data.time}
                      label='Time'
                      onChange={handleTimeChange}
                    >
                      {createTimeOptions().map((_time) => (
                        <MenuItem key={_time} value={_time}>
                          {_time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </>
            ) : (
              <>
                <Box>
                  <Typography variant='h6' gutterBottom>
                    Person Data
                  </Typography>
                  <Box sx={{ display: isMobile ? "block" : "flex", gap: 3 }}>
                    <TextField
                      id='outlined-basic'
                      label='First Name *'
                      value={data.firstName}
                      onChange={(e) =>
                        setData({ ...data, firstName: e.target.value })
                      }
                      variant='outlined'
                      sx={inputStyle}
                    />
                    <TextField
                      id='outlined-basic'
                      label='Last Name'
                      value={data.lastName}
                      onChange={(e) =>
                        setData({ ...data, lastName: e.target.value })
                      }
                      variant='outlined'
                      sx={inputStyle}
                    />
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: isMobile ? "block" : "flex", gap: 3 }}>
                    <TextField
                      id='outlined-basic'
                      label='Email'
                      type='email'
                      value={data.email}
                      sx={inputStyle}
                      onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                      }
                      variant='outlined'
                    />
                    <MuiTelInput
                      id='outlined-basic'
                      value={data.telephone}
                      onChange={(telephone) => setData({ ...data, telephone })}
                      label='Telephone'
                      sx={inputStyle}
                      variant='outlined'
                      defaultCountry='CH'
                    />
                  </Box>
                </Box>
                <Box>
                  <TextField
                    id='outlined-multiline-static'
                    placeholder='Notes'
                    multiline
                    sx={{
                      width: "100%",
                    }}
                    rows={2}
                    value={data.notes}
                    onChange={(e) =>
                      setData({ ...data, notes: e.target.value })
                    }
                  />
                </Box>
              </>
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
            onClick={() => (isLastStep ? toggleIsLastStep() : closeModal())}
          >
            {isLastStep ? "Back" : "Cancel"}
          </Button>
          <Button
            color={isLastStep ? "success" : "primary"}
            disabled={isLastStep ? isSaveDisabled : isNextDisabled}
            onClick={() =>
              isLastStep ? mutation.mutate() : toggleIsLastStep()
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
