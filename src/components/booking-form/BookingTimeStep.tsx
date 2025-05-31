import React from "react";

import { Box } from "@mui/material";

import * as S from "./BookingForm.styled";

export const BookingTimeStep = ({
  bookingTime,
  setBookingTime,
  timeOptions,
}: {
  bookingTime: string | null;
  setBookingTime: (bookingTime: string | null) => void;
  timeOptions: string[];
}) => {
  return (
    <Box display="flex">
      <Box display="flex" gap={1} flex={1} flexWrap="wrap">
        {timeOptions.map((time) => (
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
