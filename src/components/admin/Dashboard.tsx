import "firebase/compat/auth";

import React from "react";

import { Box, Typography } from "@mui/material";
import { Link } from "gatsby";

import { useAuth } from "../../hooks/useAuth";
import { RouteComponentProps } from "@reach/router";
import { ArrowForwardRounded, Settings } from "@mui/icons-material";

const Dashboard = (_: RouteComponentProps) => {
  const { user } = useAuth();

  return (
    <Box>
      {user && <h1>Hallo {user.displayName}</h1>}
      <Box display='flex' flexDirection='column' gap={2} mt={12}>
        <Typography
          component={Link}
          variant='body1'
          to='/admin/reservations'
          display='flex'
          sx={{
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          <ArrowForwardRounded />
          &nbsp; Reservations
        </Typography>
        <Typography
          component={Link}
          variant='body1'
          display='flex'
          to='/admin/events'
          sx={{
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          <ArrowForwardRounded />
          &nbsp; Events
        </Typography>
        <Typography
          component={Link}
          variant='body1'
          display='flex'
          to='/admin/settings'
          sx={{
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          <Settings />
          &nbsp; Settings
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
