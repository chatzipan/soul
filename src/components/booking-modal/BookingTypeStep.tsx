import React from "react";

import { Box, FormControl, MenuItem, Typography } from "@mui/material";

import { getDateInOneYear } from "../../utils/date";
import * as Common from "../home/Hero.styled";
import * as S from "./BookingModal.styled";

enum BookingType {
  BRUNCH = "Brunch",
  LUNCH = "Lunch",
  DINNER = "Dinner",
}
const BookingTypeIcons = {
  [BookingType.BRUNCH]: "🍳",
  [BookingType.LUNCH]: "🍲",
  [BookingType.DINNER]: "🍷",
};

export const BookingTypeStep = ({
  bookingDate,
  bookingType,
  persons,
  setBookingDate,
  setBookingTime,
  setBookingType,
  setPersons,
}: {
  bookingDate: Date;
  bookingType: BookingType | null;
  persons: number;
  setBookingDate: (bookingDate: Date) => void;
  setBookingTime: (bookingTime: string | null) => void;
  setPersons: (persons: number) => void;
  setBookingType: (bookingType: BookingType) => void;
}) => {
  const isBigGroup = persons > 6;

  return (
    <>
      <Box display="flex" alignItems="center" mb={4} flexWrap="wrap">
        <Typography variant="h6" display="inline">
          I would like to book a table for&nbsp;
        </Typography>
        <S.Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={persons ? persons.toString() : ""}
          label="Persons"
          onChange={(event) =>
            setPersons(parseInt(event.target.value as string))
          }
        >
          {Array.from(Array(7).keys()).map((p, i, arr) => (
            <MenuItem key={p} value={p + 1}>
              {p + 1}
              {i === arr.length - 1 ? "+" : ""}
            </MenuItem>
          ))}
        </S.Select>
        <Typography variant="h6" display="inline">
          &nbsp;people on&nbsp;
        </Typography>
        <S.DatePicker
          timezone="Europe/Zurich"
          disablePast
          maxDate={getDateInOneYear()}
          sx={{ width: "150px" }}
          value={bookingDate}
          onChange={(newValue: Date | null) => {
            if (!newValue) return;
            setBookingDate(newValue);
          }}
        />
      </Box>
      <Box display="flex">
        <FormControl fullWidth sx={{ flex: 1 }}>
          {!isBigGroup ? (
            Object.values(BookingType).map((type) => {
              const isDinner = type === BookingType.DINNER;
              return (
                <S.Button
                  key={type}
                  reverse={type === bookingType}
                  onClick={() => {
                    setBookingType(type);
                    type !== bookingType && setBookingTime(null);
                  }}
                >
                  <span style={{ marginRight: "1rem", fontSize: "3rem" }}>
                    {BookingTypeIcons[type]}
                  </span>
                  {type}
                </S.Button>
              );
            })
          ) : (
            <Typography variant="h6" display="inline">
              For Groups of more than 6 people, please contact us directly
              at&nbsp;
              <Common.TelLinkUnderlined
                href="mailto:hallo@soulcoffee.info"
                target="_blank"
              >
                hallo@soulcoffee.info
              </Common.TelLinkUnderlined>
            </Typography>
          )}
        </FormControl>
      </Box>
    </>
  );
};
