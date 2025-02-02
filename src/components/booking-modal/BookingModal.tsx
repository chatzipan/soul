import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DayOfWeek, OpeningHours } from "../../../functions/src/types/settings";
import { useOpeningHours } from "../../hooks/useOpeningHours";
import { createReservation } from "../../services/reservations";
import { createTimeOptions } from "../../utils/date";
import { isValidEmail } from "../admin/reservations/utils";
import * as S from "./BookingModal.styled";
import { BookingTimeStep } from "./BookingTimeStep";
import { BookingTypeStep } from "./BookingTypeStep";
import { ContactStep } from "./ContactStep";

enum Step {
  TYPE = "bookingType",
  TIME = "bookingTime",
  CONTACT = "contactDetails",
  CONFIRM = "confirmation",
}

enum BookingType {
  BRUNCH = "Brunch",
  LUNCH = "Lunch",
  DINNER = "Dinner",
}

export interface ContactData {
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  notes: string;
}

const initialContactData: ContactData = {
  firstName: "",
  lastName: "",
  telephone: "",
  email: "",
  notes: "",
};

const SORTED_DAYS = [
  DayOfWeek.Sunday,
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
];

const getInitialDate = () => {
  // TODO: put logic
  return new Date();
};

export const BookingModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [persons, setPersons] = useState<number>(2);
  const [bookingType, setBookingType] = useState<BookingType | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<Date>(getInitialDate());
  const [currentStep, setCurrentStep] = useState<Step>(Step.TYPE);
  const [contact, setContactData] = useState(initialContactData);

  const response = useOpeningHours();
  const openingDays = response?.data as unknown as Record<
    DayOfWeek,
    OpeningHours
  >;
  const bookingDay = SORTED_DAYS[bookingDate.getDay()];
  const openingHours = openingDays?.[bookingDay]?.openingHours;
  const isWeekend = [DayOfWeek.Saturday, DayOfWeek.Sunday].includes(bookingDay);

  console.log("openingHours", openingHours);
  console.log("createTimeOptions", createTimeOptions());
  console.log("isWeekend", isWeekend);

  const backLabel = [Step.TYPE, Step.CONFIRM].includes(currentStep)
    ? "Close"
    : "Back";

  const isBigGroup = persons > 6;

  const isEmailInvalid = contact.email ? isValidEmail(contact.email) : false;

  const isNextDisabled =
    currentStep === Step.TYPE
      ? !bookingType || isBigGroup
      : currentStep === Step.TIME
        ? !bookingTime
        : currentStep === Step.CONTACT
          ? !contact.firstName ||
            !contact.lastName ||
            !contact.lastName ||
            isEmailInvalid ||
            !contact.telephone
          : false;

  const closeModal = () => {
    onClose();
    setPersons(2);
    setBookingType(null);
    setBookingTime(null);
    setBookingDate(getInitialDate());
    setContactData(initialContactData);
    setCurrentStep(Step.TYPE);
  };

  const handleBack = () => {
    if (currentStep === Step.TIME) {
      setCurrentStep(Step.TYPE);
    } else if (currentStep === Step.CONTACT) {
      setCurrentStep(Step.TIME);
    } else {
      closeModal();
    }
  };

  const handleNext = () => {
    if (currentStep === Step.TYPE) {
      setCurrentStep(Step.TIME);
    } else if (currentStep === Step.TIME) {
      setCurrentStep(Step.CONTACT);
    } else if (currentStep === Step.CONTACT) {
      setCurrentStep(Step.CONFIRM);
    }
  };

  const mutation = useMutation({
    mutationFn: () => {
      return createReservation({
        ...contact,
        canceled: false,
      });
    },

    onSuccess: () => {
      closeModal();
    },
  });

  return (
    <S.Modal
      fullScreen={isMobile}
      maxWidth="xl"
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle sx={{ fontSize: "2rem" }} id="responsive-dialog-title">
        Book a table
      </DialogTitle>
      <DialogContent sx={{ pb: 0, width: { xs: "auto", sm: "500px" } }}>
        {currentStep === Step.TYPE && (
          <BookingTypeStep
            bookingDate={bookingDate}
            bookingType={bookingType}
            persons={persons}
            setBookingDate={setBookingDate}
            setBookingTime={setBookingTime}
            setBookingType={setBookingType}
            setPersons={setPersons}
          />
        )}
        {currentStep === Step.TIME && bookingType && (
          <BookingTimeStep
            bookingType={bookingType}
            bookingTime={bookingTime}
            setBookingTime={setBookingTime}
          />
        )}
        {currentStep === Step.CONTACT && (
          <ContactStep contact={contact} setContactData={setContactData} />
        )}
        {currentStep === Step.CONFIRM && <Box>Confirmation</Box>}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 3 }}>
        <Button onClick={handleBack}>{backLabel}</Button>
        {currentStep !== Step.CONFIRM && (
          <Button disabled={isNextDisabled} onClick={handleNext}>
            {currentStep === Step.CONTACT ? "Book" : "Next"}
          </Button>
        )}
      </DialogActions>
    </S.Modal>
  );
};
