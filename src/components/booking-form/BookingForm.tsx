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
  BookingType,
  Reservation,
} from "../../../functions/src/types/reservation";
import {
  DayOfWeek,
  RestaurantSettings,
} from "../../../functions/src/types/settings";
import { useOpeningHours } from "../../hooks/useOpeningHours";
import {
  createReservationPublic,
  updateReservationPublic,
} from "../../services/reservations";
import { isValidEmail } from "../admin/reservations/utils";
import * as S from "./BookingForm.styled";
import { BookingTimeStep } from "./BookingTimeStep";
import { BookingTypeStep } from "./BookingTypeStep";
import { ContactStep } from "./ContactStep";
import { ContactData } from "./types";
import {
  createTimeOptionsFromOpeningHours,
  getBookingTypeForTime,
  getZurichTimeNow,
} from "./utils";

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

export const BookingForm = ({
  isOpen,
  initialReservation,
  onClose,
  onSuccess,
  selectedDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: Reservation) => void;
  initialReservation?: Reservation;
  selectedDate?: Date | null;
}) => {
  const dateInZurichNow = new Date(getZurichTimeNow().split(" ")[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isEditMode = !!initialReservation;
  const [currentStep, setCurrentStep] = useState<Step>(Step.TYPE);
  const response = useOpeningHours();
  const settings = response?.data as unknown as RestaurantSettings;
  const [bookingDate, setBookingDate] = useState<Date>(
    selectedDate || dateInZurichNow,
  );

  const bookingDay = SORTED_DAYS[bookingDate.getDay()];

  const [persons, setPersons] = useState<number>(
    initialReservation?.persons || 2,
  );

  const [bookingTime, setBookingTime] = useState<string | null>(
    initialReservation?.time || null,
  );

  const bookingTypeForTime = useMemo(() => {
    if (!isEditMode) return null;

    return getBookingTypeForTime(
      initialReservation?.time,
      settings?.openingDays?.[bookingDay]?.offersDinner || false,
      bookingDay,
      bookingDate,
      settings as RestaurantSettings,
    );
  }, [bookingDay, bookingDate, settings, isEditMode, initialReservation]);

  const [bookingType, setBookingType] = useState<BookingType | null>(
    initialReservation ? bookingTypeForTime : null,
  );

  const [contact, setContactData] = useState(
    isEditMode
      ? {
          firstName: initialReservation.firstName,
          lastName: initialReservation.lastName,
          email: initialReservation.email,
          telephone: initialReservation.telephone,
          notes: initialReservation.notes,
        }
      : initialContactData,
  );

  const backLabel = [Step.TYPE, Step.CONFIRM].includes(currentStep)
    ? "Close"
    : "Back";

  const isBigGroup = persons > 6;

  const isEmailInvalid = contact.email ? isValidEmail(contact.email) : true;

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

  const isDinnerDay =
    settings?.openingDays?.[bookingDay]?.offersDinner || false;

  const timeOptionsPerType = useMemo(
    () =>
      [
        BookingType.BRUNCH,
        BookingType.LUNCH,
        BookingType.APERO,
        ...(isDinnerDay ? [BookingType.DINNER] : []),
      ].reduce(
        (acc, type) => {
          if (!type) return acc;
          acc[type] = createTimeOptionsFromOpeningHours({
            bookingType: type,
            currentDayOfWeek: bookingDay,
            isDinnerDay,
            selectedDate: bookingDate,
            settings,
          });
          return acc;
        },
        {} as Record<BookingType, string[]>,
      ),
    [bookingDay, bookingDate, isDinnerDay, settings],
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

      if (isEditMode) {
        const data = {
          ...initialReservation,
          edited: true,
          date: zurichTime.toDate().getTime(),
          email: contact.email.toLowerCase().trim(),
          firstName: contact.firstName,
          lastName: contact.lastName,
          notes: contact.notes,
          persons: persons,
          telephone: contact.telephone,
          time: bookingTime || "",
          bookingType: bookingType as BookingType,
        };
        const response = await updateReservationPublic(data);
        onSuccess?.(data);
        return response;
      } else {
        const data = {
          date: zurichTime.toDate().getTime(),
          disableParallelBookings: false,
          durationHours: undefined,
          email: contact.email.toLowerCase().trim(),
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
          time: bookingTime || "",
          bookingType: bookingType as BookingType,
        };
        return createReservationPublic(data);
      }
    },
    onSuccess: () => {
      setCurrentStep(Step.CONFIRM);
      response?.refetch();
    },
  });

  useEffect(() => {
    const dateInZurichNow = new Date(getZurichTimeNow().split(" ")[0]);

    if (selectedDate) {
      setBookingDate(
        selectedDate >= dateInZurichNow ? selectedDate : dateInZurichNow,
      );
    }
  }, [selectedDate]);

  useEffect(() => {
    if (isEditMode) {
      setBookingType(bookingTypeForTime);
    }
  }, [bookingTypeForTime, isEditMode]);

  if (response?.isError) {
    return (
      <>
        <Typography variant="h5" color="error">
          Our booking system is currently down.
        </Typography>
        <Typography>
          Please try again later or contact us directly via phone or email.
        </Typography>
      </>
    );
  }

  const content = (
    <>
      {!isEditMode && (
        <DialogTitle sx={{ fontSize: "2rem" }} id="responsive-dialog-title">
          Book a table
        </DialogTitle>
      )}
      <DialogContent sx={{ pb: 0, width: { xs: "auto", md: "500px" } }}>
        {currentStep === Step.TYPE && (
          <BookingTypeStep
            availableBookingTypes={availableBookingTypes}
            bookingDate={bookingDate}
            bookingType={bookingType}
            isLoading={response?.isLoading}
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
            isEditMode={isEditMode}
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
              Your reservation has been {isEditMode ? "updated" : "confirmed"}.
              You will receive a confirmation email shortly.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 3 }}>
        {!(isEditMode && [Step.TYPE, Step.CONFIRM].includes(currentStep)) && (
          <Button onClick={handleBack}>{backLabel}</Button>
        )}
        {currentStep !== Step.CONFIRM && (
          <Button
            style={{ marginLeft: "auto" }}
            disabled={isNextDisabled || isPending}
            onClick={handleNext}
          >
            {currentStep === Step.CONTACT
              ? initialReservation
                ? "Update"
                : "Book"
              : "Next"}
          </Button>
        )}
      </DialogActions>
    </>
  );

  if (isEditMode) {
    return content;
  }

  return (
    <S.Modal
      fullScreen={isMobile}
      maxWidth="xl"
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="responsive-dialog-title"
    >
      {content}
    </S.Modal>
  );
};
