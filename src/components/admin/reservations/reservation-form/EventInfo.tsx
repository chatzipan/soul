import React from "react";

import {
  Switch,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  FormControlLabel,
  Box,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Reservation } from "../../../../types";

const inputStyle = {
  minWidth: {
    xs: "100%",
    md: 320,
  },
  mb: 3,
};

export const EventInfo = ({
  data,
  setData,
}: {
  data: Omit<Reservation, "id" | "canceled">;
  setData: (data: Omit<Reservation, "id" | "canceled">) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDurationChange = (event: SelectChangeEvent) => {
    setData({ ...data, durationHours: parseInt(event.target.value) });
  };

  return (
    <div>
      <Typography variant='h6' gutterBottom sx={{ mb: 1 }}>
        Event Duration in Hours
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id='demo-simple-select-label'>Hours</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={data.durationHours ? data.durationHours.toString() : ""}
          sx={{ minWidth: 320 }}
          label='Duration'
          onChange={handleDurationChange}
        >
          {Array.from(Array(4).keys()).map((p) => (
            <MenuItem key={p} value={p + 1}>
              {p + 1} hours
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant='h6' gutterBottom>
        Disable reservations during this event?
      </Typography>
      <FormControlLabel
        sx={{ mb: 2 }}
        control={
          <Switch
            checked={data.disableParallelBookings}
            inputProps={{ "aria-label": "controlled" }}
            onChange={(e) =>
              setData({
                ...data,
                disableParallelBookings: e.target.checked,
              })
            }
          />
        }
        label={data.isEvent ? "Yes" : "No"}
      />
      <Typography variant='h6' gutterBottom>
        Is that a Soul event or a private event?
      </Typography>
      <FormControlLabel
        sx={{ mb: 2 }}
        control={
          <Switch
            checked={data.isOwnEvent}
            inputProps={{ "aria-label": "controlled" }}
            onChange={(e) =>
              setData({
                ...data,
                isOwnEvent: e.target.checked,
              })
            }
          />
        }
        label={data.isOwnEvent ? "Soul Event" : "Private Event"}
      />

      {data.isOwnEvent && (
        <Box>
          <Typography variant='h6' gutterBottom>
            Event Title
          </Typography>
          <Box sx={{ display: isMobile ? "block" : "flex", gap: 3 }}>
            <TextField
              id='outlined-basic'
              label='Event Title *'
              value={data.eventTitle}
              onChange={(e) => setData({ ...data, eventTitle: e.target.value })}
              variant='outlined'
              sx={inputStyle}
            />
          </Box>
          <Box>
            <TextField
              id='outlined-multiline-static'
              placeholder='Event Info'
              multiline
              sx={{
                width: "100%",
              }}
              rows={2}
              value={data.eventInfo}
              onChange={(e) => setData({ ...data, eventInfo: e.target.value })}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};
