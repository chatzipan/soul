import React, { useMemo } from "react";

import { ThemeProvider, createTheme } from "@mui/material";
import { Redirect, Router } from "@reach/router";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Dashboard from "../../components/admin/Dashboard";
import Login from "../../components/admin/Login";
import Layout from "../../components/admin/layout/Layout";
import Reservations from "../../components/admin/reservations/Reservations";
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
});

const Inner = () => {
  const { logout } = useAuth();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onSuccess(data: any) {
            if (data?.code?.startsWith("auth/")) {
              //
              return logout();
            }
          },
        }),
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={customTheme}>
        <Layout>
          <Router basepath='/admin'>
            <PrivateRoute path='/reservations' component={Reservations} />
            <PrivateRoute path='/' component={Dashboard} />
            <Login path='/login' />
            <Redirect from='*' to='/' />
          </Router>
        </Layout>
      </ThemeProvider>
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
