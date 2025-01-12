import React from "react";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Reservation } from "../../../../../functions/src/types/reservation";

const createTimeOptions = () => {
  // create options every 15 minutes
  const options = [];
  for (let i = 8; i < 22; i++) {
    for (let j = 0; j < 60; j += 15) {
      const hours = `${i}`.padStart(2, "0");
      const minutes = `${j}`.padEnd(2, "0");
      options.push(`${hours}:${minutes}`);
    }
  }
  return options.concat("22:00");
};

export const BasicInfo = ({
  data,
  isEvent,
  setData,
}: {
  data: Omit<Reservation, "id" | "canceled">;
  isEvent?: boolean;
  setData: (data: Omit<Reservation, "id" | "canceled">) => void;
}) => {
  const handlePersonsChange = (event: SelectChangeEvent) => {
    setData({ ...data, persons: parseInt(event.target.value) });
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    setData({ ...data, time: event.target.value });
  };

  return (
    <>
      <div>
        <Typography variant='h6' gutterBottom>
          Select Date
        </Typography>
        <DateCalendar
          disablePast
          maxDate={new Date("2025-12-31").getTime()}
          onChange={(newDate) => {
            setData({
              ...data,
              date: new Date(newDate).getTime(),
            });
          }}
          timezone='Europe/Zurich'
          value={data.date ? data.date : null}
        />
      </div>
      <div>
        <Typography variant='h6' gutterBottom sx={{ mb: 1 }}>
          Select Persons
        </Typography>
        <FormControl fullWidth sx={{ mb: 8 }}>
          <InputLabel id='demo-simple-select-label'>Persons</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={data.persons ? data.persons.toString() : ""}
            sx={{ minWidth: 320 }}
            label='Persons'
            onChange={handlePersonsChange}
          >
            {Array.from(Array(isEvent ? 40 : 20).keys()).map((p) => (
              <MenuItem key={p} value={p + 1}>
                {p + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant='h6' gutterBottom sx={{ mb: 1 }}>
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
  );
};
