// with date-fns v2.x
import React from "react";

import type { HeadFC } from "gatsby";

import { ThemeProvider, createTheme } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Redirect, Router } from "@reach/router";
import de from "date-fns/locale/de";

import MenuCategory from "../../components/menu/category";
import MenuEntry from "../../components/menu/entry";
import SEO from "../../components/shared/SEO";

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
        <Router basepath="/menu">
          <MenuEntry path="/" />
          <MenuCategory path=":categoryId" />
          <Redirect from="*" to="/" />
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default Menu;

export const Head: HeadFC = ({ location, params }) => {
  // If we have a categoryId, it's a category page
  const isCategoryPage = params?.["*"]?.length > 0;
  const categoryId = params["*"];
  const formattedCategory = categoryId
    ? decodeURI(categoryId)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "";

  return (
    <SEO
      title={isCategoryPage ? `${formattedCategory} Menu` : "Menu"}
      description={
        isCategoryPage
          ? `Discover our ${formattedCategory} menu at Soul Café Zurich. Fresh, seasonal ingredients prepared with passion.`
          : "Explore our diverse menu featuring brunch, lunch, dinner, cocktails, and an extensive wine selection at Soul Café Zurich."
      }
      pathname={location?.pathname}
    />
  );
};
