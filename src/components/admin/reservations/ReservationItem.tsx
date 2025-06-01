import React, { useState } from "react";

import CallIcon from "@mui/icons-material/Call";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EmailIcon from "@mui/icons-material/Email";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import Popover from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { isBefore } from "date-fns";

import { Reservation } from "../../../../functions/src/types/reservation";
import * as S from "./Reservations.styled";

const ITEM_HEIGHT = 48;

export const ReservationItem = ({
  isEvent,
  openCancelModal,
  openEditModal,
  reservation,
}: {
  isEvent?: boolean;
  openCancelModal: (reservation: Reservation) => void;
  openEditModal: (reservation: Reservation) => void;
  reservation: Reservation;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  const handleTooltipClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setTooltipId(id);
  };

  const handleTooltipClose = () => {
    setAnchorEl(null);
    setTooltipId(null);
  };

  const {
    date,
    email,
    isOwnEvent,
    notes,
    eventInfo,
    eventTitle,
    firstName,
    lastName,
    time,
    telephone,
  } = reservation;
  const _lastName = lastName && !isSmallMobile ? ` ${lastName}` : "";
  const fullName = `${firstName}${_lastName}`;
  const hasContact = email || telephone;
  const hasEmail = email ? 1 : 0;
  const hasTelephone = telephone ? 1 : 0;
  const hasNotes = notes ? 1 : 0;
  const actionNumbers = hasEmail + hasTelephone + hasNotes;
  const info = notes || eventInfo;
  const title = isOwnEvent ? `🍷 SOUL: ${eventTitle}` : fullName;
  const isBeforeToday = isBefore(
    new Date(date).setHours(0, 0, 0, 0),
    new Date().setHours(0, 0, 0, 0),
  );

  const [anchorElMore, setAnchorElMore] = React.useState<null | HTMLElement>(
    null,
  );
  const openMore = Boolean(anchorElMore);
  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMore(event.currentTarget);
  };
  const handleCloseMore = () => {
    setAnchorElMore(null);
  };

  return (
    <S.ListItem key={reservation.id}>
      <S.ReservationText sx={{ fontSize: 20 }}>
        <S.ReservationTextInner>
          <S.ReservationTextBasic canceled={reservation.canceled}>
            <S.ReservationTime>{time}</S.ReservationTime>
            {!isOwnEvent && (
              <>
                &nbsp;&#183;&nbsp;
                <S.ReservationPersons isMobile={isMobile}>
                  <>
                    <GroupsIcon
                      sx={{
                        mr: 1,
                        display: isMobile && !isSmallMobile ? "block" : "none",
                      }}
                    />
                    {reservation.persons}&nbsp;
                    {!isMobile && "persons"}
                    {isSmallMobile && "P"}
                  </>
                </S.ReservationPersons>
              </>
            )}
            &nbsp;&#183;&nbsp;
            <Typography
              noWrap
              component="span"
              style={{
                display: "block",
                width: "100%",
                fontSize: "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: `calc(43vw - ${actionNumbers} * 2vw)`,
              }}
              title={title}
            >
              {title}
            </Typography>
            {isEvent && reservation.isEvent && (
              <Chip
                label="EVENT"
                color="primary"
                size="small"
                component="span"
                sx={{ mr: 1 }}
              />
            )}
            {info && (
              <Button
                onClick={(e) => handleTooltipClick(e, reservation.id)}
                sx={{
                  p: 0,
                  ml: 1,
                  mr: 1,
                  minWidth: 0,
                }}
              >
                <InfoOutlinedIcon sx={{ cursor: "pointer" }} />
              </Button>
            )}
            <Popover
              open={tooltipId === reservation.id}
              anchorEl={anchorEl}
              onClose={handleTooltipClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Typography sx={{ p: 2 }}>{info}</Typography>
            </Popover>
          </S.ReservationTextBasic>
          {reservation.canceled && (
            <Chip
              label="Canceled"
              color="error"
              variant="outlined"
              size="small"
              component="span"
              sx={{ ml: 1 }}
            />
          )}
          {reservation.edited && (
            <Chip
              label="Edited"
              color="info"
              variant="outlined"
              size="small"
              component="span"
              sx={{ ml: 1 }}
            />
          )}
          {hasContact && !isOwnEvent && (
            <S.ReservationContact>
              {telephone && !isSmallMobile && (
                <S.ReservationLink href={`tel:${telephone}`} target="_blank">
                  {isMobile ? <CallIcon /> : telephone}
                </S.ReservationLink>
              )}
              {email && !isSmallMobile && (
                <S.ReservationLink href={`mailto:${email}`} target="_blank">
                  {isMobile ? <EmailIcon /> : email}
                </S.ReservationLink>
              )}
            </S.ReservationContact>
          )}
        </S.ReservationTextInner>
      </S.ReservationText>
      {isSmallMobile ? (
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMore ? "long-menu" : undefined}
            aria-expanded={openMore ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClickMore}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorElMore}
            open={openMore}
            onClose={handleCloseMore}
            slotProps={{
              paper: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              },
            }}
          >
            <MenuItem
              onClick={() => openEditModal(reservation)}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              disabled={reservation.canceled || isBeforeToday}
            >
              <EditCalendarIcon />
              &nbsp;Edit {isEvent ? "event" : "reservation"}
            </MenuItem>
            <MenuItem
              onClick={() => openCancelModal(reservation)}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              disabled={reservation.canceled || isBeforeToday}
            >
              <EventBusyIcon />
              &nbsp;Cancel {isEvent ? "event" : "reservation"}
            </MenuItem>
            {telephone && (
              <MenuItem
                onClick={() => {
                  window.open(`tel:${telephone}`, "_blank");
                }}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                disabled={reservation.canceled || isBeforeToday}
              >
                <S.ReservationLink href={`tel:${telephone}`} target="_blank">
                  <CallIcon />
                  &nbsp;Call
                </S.ReservationLink>
              </MenuItem>
            )}

            {email && (
              <MenuItem
                onClick={() => {
                  window.open(`mailto:${email}`, "_blank");
                }}
                disabled={reservation.canceled || isBeforeToday}
              >
                <S.ReservationLink href={`mailto:${email}`} target="_blank">
                  <EmailIcon />
                  &nbsp;&nbsp;Email
                </S.ReservationLink>
              </MenuItem>
            )}
          </Menu>
        </div>
      ) : (
        <S.Actions>
          <S.ActionButton
            isMobile={isMobile}
            canceled={reservation.canceled}
            onClick={() => openEditModal(reservation)}
            disabled={reservation.canceled || isBeforeToday}
          >
            Edit
          </S.ActionButton>
          <S.ActionButton
            color="error"
            isMobile={isMobile}
            canceled={reservation.canceled}
            onClick={() => openCancelModal(reservation)}
            disabled={reservation.canceled || isBeforeToday}
            sx={{ mt: { xs: 0.25, sm: 0 } }}
          >
            Cancel
          </S.ActionButton>
        </S.Actions>
      )}
    </S.ListItem>
  );
};
