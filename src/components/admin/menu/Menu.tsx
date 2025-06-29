import React from "react";

import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { RouteComponentProps } from "@reach/router";

import { useUpdateMenu } from "../../../hooks/useUpdateMenu";
import * as S from "./Menu.styled";

const Menu = (_: RouteComponentProps) => {
  const { mutate: updateMenu, isPending, error, data } = useUpdateMenu();

  return (
    <S.Wrapper>
      <Typography variant="h3" sx={{ mb: 4 }}>
        <RestaurantMenuIcon fontSize="large" />
        &nbsp;Menu Management
      </Typography>

      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Update the restaurant menu from Lightspeed. This will fetch the latest
          menu data and update the website.
        </Typography>
        <Typography variant="body1">What you need to do:</Typography>
        <ol>
          <Typography variant="body1">
            <li>Update the items you need in Lightspeed</li>
          </Typography>
          <Typography>
            <li>
              Wait first until your changes are visible in the&nbsp;
              <a
                href="https://mylightspeed.app/UYRRDNWF/C-ordering/menu"
                target="_blank"
                rel="noreferrer"
              >
                online menu page
              </a>
            </li>
          </Typography>
          <Typography>
            <li>
              When the changes are visible, click on the "UPDATE MENU" button
              below.
            </li>
          </Typography>
          <Typography>
            <li>
              In around 5 minutes, check if the changes are in&nbsp;
              <a
                href="https://soulzuerich.ch/menu/"
                target="_blank"
                rel="noreferrer"
              >
                our website
              </a>
              . If the changes are not visible, contact Vasilis.
            </li>
          </Typography>
        </ol>

        <Button
          variant="contained"
          onClick={() => updateMenu()}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          {isPending ? "Updating..." : "Update Menu"}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error instanceof Error ? error.message : "An error occurred"}
          </Alert>
        )}

        {data?.message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {data.message}
          </Alert>
        )}

        {data?.changes && data.changes.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Changes:
            </Typography>
            <ol>
              {data.changes.map((change, index) => (
                <li key={index}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <span dangerouslySetInnerHTML={{ __html: change }} />
                  </Typography>
                </li>
              ))}
            </ol>
          </Box>
        )}
      </Box>
    </S.Wrapper>
  );
};

export default Menu;
