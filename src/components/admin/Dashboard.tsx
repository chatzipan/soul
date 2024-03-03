import "firebase/compat/auth";

import React from "react";

import { Box } from "@mui/material";
import { RouteComponentProps } from "@reach/router";

import { useAuth } from "../../hooks/useAuth";

const Dashboard = (_: RouteComponentProps) => {
  const { user } = useAuth();

  return (
    <Box sx={{ pt: 4 }}>
      {user && <h1>Hallo {user.displayName}</h1>}
      <h1>Admin Dashboard</h1>
    </Box>
  );
};

export default Dashboard;
