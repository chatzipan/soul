import { MuiTelInput } from "mui-tel-input";
import React from "react";

import { Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Reservation } from "../../../../types";

const inputStyle = {
  minWidth: {
    xs: "100%",
    md: 320,
  },
  mb: 3,
};

export const ContactInfo = ({
  data,
  setData,
}: {
  data: Omit<Reservation, "id" | "canceled">;
  setData: (data: Omit<Reservation, "id" | "canceled">) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
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
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
            variant='outlined'
            sx={inputStyle}
          />
          <TextField
            id='outlined-basic'
            label='Last Name *'
            value={data.lastName}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
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
            onChange={(e) => setData({ ...data, email: e.target.value })}
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
          onChange={(e) => setData({ ...data, notes: e.target.value })}
        />
      </Box>
    </>
  );
};
