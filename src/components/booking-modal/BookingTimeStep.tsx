import React from "react";

import { Box } from "@mui/material";

import * as S from "./BookingModal.styled";

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

const hoursPerBookingType = {
  [BookingType.BRUNCH]: [
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
  ],
  [BookingType.LUNCH]: [
    "12:00",
    "12:15",
    "12:30",
    "12:45",
    "13:00",
    "13:15",
    "13:30",
    "13:45",
    "14:00",
    "14:15",
    "14:30",
    "14:45",
    "15:00",
    "15:15",
    "15:30",
  ],
  [BookingType.DINNER]: [
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
    "20:15",
    "20:30",
    "20:45",
    "21:00",
  ],
};

export const BookingTimeStep = ({
  bookingType,
  bookingTime,
  setBookingTime,
}: {
  bookingType: BookingType;
  bookingTime: string | null;
  setBookingTime: (bookingTime: string | null) => void;
}) => {
  return (
    <Box display="flex">
      <Box display="flex" gap={1} flex={1} flexWrap="wrap">
        {hoursPerBookingType[bookingType].map((time) => (
          <S.TimeButton
            key={time}
            reverse={time === bookingTime}
            onClick={() => setBookingTime(time)}
          >
            {time}
          </S.TimeButton>
        ))}
      </Box>
    </Box>
  );
};
