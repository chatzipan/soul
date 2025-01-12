import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Link } from "gatsby";
import { Box, Typography } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import TableBarIcon from "@mui/icons-material/TableBar";

import { Router, Redirect } from "@reach/router";
import OpeningHours from "./OpeningHours";
import OtherSettings from "./OtherSettings";
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
      iconPosition='end'
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

const Settings = (_: RouteComponentProps) => {
  const location =
    typeof window !== "undefined" ? window.location.pathname : "";
  const [value, setValue] = React.useState(location.includes("other") ? 1 : 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant='h3' sx={{ mb: 4 }}>
        <TuneIcon fontSize='large' />
        &nbsp;Settings
      </Typography>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label='settings navigation tabs'
        role='navigation'
      >
        <LinkTab
          icon={<AccessTimeIcon />}
          label='Opening Hours'
          href='opening-hours'
        />
        <LinkTab
          icon={<TableBarIcon />}
          label='Reservations Config'
          href='reservation-config'
        />
      </Tabs>

      <Router>
        <Redirect from='/' to='opening-hours' noThrow />
        <OpeningHours path='opening-hours' />
        <OtherSettings path='config' />
      </Router>
    </Box>
  );
};

export default Settings;
