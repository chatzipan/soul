import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";

import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { format } from "date-fns";
import moment from "moment-timezone";

import {
  DayOfWeek,
  RestaurantSettings,
} from "../../../functions/src/types/settings";
import { useOpeningHours } from "../../hooks/useOpeningHours";
import { createReservationPublic } from "../../services/reservations";
import { createTimeOptionsFromOpeningHours } from "../../utils/date";
import { isValidEmail } from "../admin/reservations/utils";
import * as S from "./BookingModal.styled";
import { BookingTimeStep } from "./BookingTimeStep";
import { BookingTypeStep } from "./BookingTypeStep";
import { ContactStep } from "./ContactStep";
import { BookingType, ContactData } from "./types";

enum Step {
  TYPE = "bookingType",
  TIME = "bookingTime",
  CONTACT = "contactDetails",
  CONFIRM = "confirmation",
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

export const getZurichTimeNow = () =>
  moment.tz("Europe/Zurich").format("YYYY-MM-DD HH:mm");

export const BookingModal = ({
  isOpen,
  onClose,
  initialDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date | null;
}) => {
  const dateInZurichNow = new Date(getZurichTimeNow().split(" ")[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [persons, setPersons] = useState<number>(2);
  const [bookingType, setBookingType] = useState<BookingType | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<Date>(
    initialDate || dateInZurichNow,
  );

  useEffect(() => {
    const dateInZurichNow = new Date(getZurichTimeNow().split(" ")[0]);

    if (initialDate) {
      setBookingDate(
        initialDate >= dateInZurichNow ? initialDate : dateInZurichNow,
      );
    }
  }, [initialDate]);

  const [currentStep, setCurrentStep] = useState<Step>(Step.TYPE);
  const [contact, setContactData] = useState(initialContactData);
  const response = useOpeningHours();
  const settings = response?.data as unknown as RestaurantSettings;
  const bookingDay = SORTED_DAYS[bookingDate.getDay()];

  const backLabel = [Step.TYPE, Step.CONFIRM].includes(currentStep)
    ? "Close"
    : "Back";

  const isBigGroup = persons > 6;

  const isEmailInvalid = contact.email ? isValidEmail(contact.email) : false;

  const isNextDisabled =
    currentStep === Step.CONTACT
      ? !contact.firstName ||
        !contact.lastName ||
        !contact.lastName ||
        isEmailInvalid ||
        !contact.telephone
      : currentStep === Step.TIME
        ? !bookingTime
        : !bookingType || isBigGroup;

  const timeOptionsPerType = useMemo(
    () =>
      [BookingType.BRUNCH, BookingType.LUNCH, BookingType.DINNER].reduce(
        (acc, type) => {
          acc[type] = createTimeOptionsFromOpeningHours({
            bookingType: type,
            currentDayOfWeek: bookingDay,
            selectedDate: bookingDate,
            settings,
          });
          return acc;
        },
        {} as Record<BookingType, string[]>,
      ),
    [bookingDay, bookingDate, settings],
  );

  const timeOptions = bookingType ? timeOptionsPerType[bookingType] : [];

  const availableBookingTypes = Object.keys(timeOptionsPerType).filter(
    (type) => timeOptionsPerType[type as BookingType].length > 0,
  ) as BookingType[];

  const closeModal = () => {
    onClose();
    setPersons(2);
    setBookingType(null);
    setBookingTime(null);
    setBookingDate(dateInZurichNow);
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

  const handleNext = async () => {
    if (currentStep === Step.TYPE) {
      setCurrentStep(Step.TIME);
    } else if (currentStep === Step.TIME) {
      setCurrentStep(Step.CONTACT);
    } else if (currentStep === Step.CONTACT) {
      await mutate();
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formattedDate = format(bookingDate, "yyyy-MM-dd");

      const zurichTime = moment.tz(
        `${formattedDate} ${bookingTime}`,
        "Europe/Zurich",
      );

      return createReservationPublic({
        date: zurichTime.toDate().getTime(),
        disableParallelBookings: false,
        durationHours: undefined,
        email: contact.email,
        eventInfo: "",
        eventTitle: "",
        firstName: contact.firstName,
        isEvent: false,
        isOwnEvent: false,
        lastName: contact.lastName,
        notes: contact.notes,
        persons: persons,
        telephone: contact.telephone,
        canceled: false,
      });
    },
    onSuccess: () => {
      setCurrentStep(Step.CONFIRM);
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
            availableBookingTypes={availableBookingTypes}
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
            bookingTime={bookingTime}
            setBookingTime={setBookingTime}
            timeOptions={timeOptions}
          />
        )}
        {currentStep === Step.CONTACT && (
          <ContactStep
            contact={contact}
            isPending={isPending}
            setContactData={setContactData}
          />
        )}
        {currentStep === Step.CONFIRM && (
          <Box>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
              ✅
            </Typography>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Your reservation has been confirmed. You will receive a
              confirmation email shortly.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 3 }}>
        <Button onClick={handleBack}>{backLabel}</Button>
        {currentStep !== Step.CONFIRM && (
          <Button disabled={isNextDisabled || isPending} onClick={handleNext}>
            {currentStep === Step.CONTACT ? "Book" : "Next"}
          </Button>
        )}
      </DialogActions>
    </S.Modal>
  );
};
