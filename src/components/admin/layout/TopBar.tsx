import { Link } from "gatsby";
import React, { useState } from "react";

import AccountCircle from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InsertInvitationSharpIcon from "@mui/icons-material/InsertInvitationSharp";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { RouteComponentProps } from "@reach/router";

import { useAuth } from "../../../hooks/useAuth";

const TopBar = (_: RouteComponentProps) => {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div'>
            Soul Admin
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              ml: 4,
              alignItems: "center",
              gap: 3,
            }}
          >
            <Typography
              component={Link}
              variant='body1'
              to='/admin'
              fontSize={14}
              sx={{
                color: "white",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Home
            </Typography>
            <Typography
              component={Link}
              variant='body1'
              fontSize={14}
              to='/admin/reservations'
              sx={{
                color: "white",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Reservations
            </Typography>
            <Typography
              component={Link}
              variant='body1'
              fontSize={14}
              to='/admin/events'
              sx={{
                color: "white",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Events
            </Typography>
          </Box>
          {user && (
            <Box sx={{ ml: "auto" }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize='small' />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <MuiDrawer
        open={open}
        onClose={toggleDrawer}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component='nav'>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <Link
              to='/admin'
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer}
            >
              <ListItemText primary='Dashboard' />
            </Link>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon sx={{ fontSize: 24 }}>🍲</ListItemIcon>
            <Link
              to='/admin/reservations'
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer}
            >
              <ListItemText primary='Reservations' />
            </Link>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon sx={{ fontSize: 24 }}>🍷</ListItemIcon>
            <Link
              to='/admin/events'
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={toggleDrawer}
            >
              <ListItemText primary='Events' />
            </Link>
          </ListItemButton>
        </List>
      </MuiDrawer>
    </>
  );
};

export default TopBar;
