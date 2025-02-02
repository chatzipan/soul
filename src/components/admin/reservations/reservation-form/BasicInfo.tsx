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
import { createTimeOptions, getDateInOneYear } from "../../../../utils/date";

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
        <Typography variant="h6" gutterBottom>
          Select Date
        </Typography>
        <DateCalendar
          disablePast
          maxDate={getDateInOneYear().getTime()}
          onChange={(newDate) =>
            setData({
              ...data,
              date: new Date(newDate).getTime(),
            })
          }
          timezone="Europe/Zurich"
          value={data.date ? data.date : null}
        />
      </div>
      <div>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Select Persons
        </Typography>
        <FormControl fullWidth sx={{ mb: 8 }}>
          <InputLabel id="demo-simple-select-label">Persons</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={data.persons ? data.persons.toString() : ""}
            sx={{ minWidth: 320 }}
            label="Persons"
            onChange={handlePersonsChange}
          >
            {Array.from(Array(isEvent ? 40 : 20).keys()).map((p) => (
              <MenuItem key={p} value={p + 1}>
                {p + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
          Select Time
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Time</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={data.time}
            label="Time"
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
