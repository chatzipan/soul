// with date-fns v2.x
import de from "date-fns/locale/de";
import React from "react";

import { ThemeProvider, createTheme } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Redirect, Router } from "@reach/router";

import MenuEntry from "../../components/menu/entry";
import MenuCategory from "../../components/menu/category";

const customTheme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Josefin Sans",
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

const Menu = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <ThemeProvider theme={customTheme}>
        <Router basepath='/menu'>
          <MenuEntry path='/' />
          <MenuCategory path=':categoryId' />
          <Redirect from='*' to='/' />
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default Menu;
