import React from "react";

import { Link } from "gatsby";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import TableBarIcon from "@mui/icons-material/TableBar";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { RouteComponentProps } from "@reach/router";
import { Redirect, Router } from "@reach/router";

import BlockedDates from "./BlockedDates";
import OpeningHours from "./OpeningHours";
import RestaurantData from "./RestaurantData";

interface LinkTabProps {
  label?: string;
  href?: string;
  selected?: boolean;
  icon?: any;
}

function LinkTab(props: LinkTabProps) {
  const { href } = props;
  const navigate =
    typeof window !== "undefined" ? require("@reach/router").navigate : null;

  return (
    <Tab
      component={Link}
      to={href || ""}
      iconPosition="end"
      icon={props.icon}
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        if (navigate) {
          navigate(href);
        }
      }}
      aria-current={props.selected && "page"}
      {...props}
    />
  );
}

const Settings = () => {
  const location =
    typeof window !== "undefined" ? window.location.pathname : "";
  const [value, setValue] = React.useState(
    location.includes("restaurant-data")
      ? 1
      : location.includes("blocked-dates")
        ? 2
        : 0,
  );

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 4 }}>
        <TuneIcon fontSize="large" />
        &nbsp;Settings
      </Typography>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="settings navigation tabs"
        role="navigation"
      >
        <LinkTab
          icon={<AccessTimeIcon />}
          label="Opening Hours"
          href="/admin/settings/opening-hours"
        />
        <LinkTab
          icon={<TableBarIcon />}
          label="Restaurant Data"
          href="/admin/settings/restaurant-data"
        />
        <LinkTab
          icon={<BlockIcon />}
          label="Blocked Dates"
          href="/admin/settings/blocked-dates"
        />
      </Tabs>

      <Router>
        <Redirect from="/" to="opening-hours" noThrow />
        <OpeningHours path="opening-hours" />
        <RestaurantData path="restaurant-data" />
        <BlockedDates path="blocked-dates" />
      </Router>
    </Box>
  );
};

export default Settings;
