// with date-fns v2.x
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React, { useMemo } from "react";

import { ThemeProvider, createTheme } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Redirect, Router } from "@reach/router";
import de from "date-fns/locale/de";

import Dashboard from "../../components/admin/Dashboard";
import Login from "../../components/admin/Login";
import Layout from "../../components/admin/layout/Layout";
import Events from "../../components/admin/reservations/Events";
import Reservations from "../../components/admin/reservations/Reservations";
import Settings from "../../components/admin/settings/Settings";
import PrivateRoute from "../../components/shared/PrivateRoute";
import { useAuth } from "../../hooks/useAuth";
import { AuthProvider } from "../../providers/AuthProvider";

const customTheme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  palette: {
    primary: {
      main: "#1B4235",
    },
    secondary: {
      main: "#f5c469",
    },
  },
});

const Inner = () => {
  const { forceReauthenticate } = useAuth();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError(error: any) {
            console.error("onError !!", error);
            // Check for auth errors
            if (
              error?.code?.startsWith("auth/") ||
              error?.response?.status === 401
            ) {
              forceReauthenticate();
            }
          },
        }),
      }),
    [forceReauthenticate],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <ThemeProvider theme={customTheme}>
          <Layout>
            <Router basepath="/admin">
              <PrivateRoute path="/reservations" component={Reservations} />
              <PrivateRoute path="/events" component={Events} />
              <PrivateRoute path="/settings/*" component={Settings} />
              <PrivateRoute path="/" component={Dashboard} />
              <Login path="/login" />
              <Redirect from="*" to="/" />
            </Router>
          </Layout>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

const Admin = () => {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
};

export default Admin;
