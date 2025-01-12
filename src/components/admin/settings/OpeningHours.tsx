import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { useSettings, useUpdateSettings } from "../../../hooks/useSettings";
import {
  DayOfWeek,
  RestaurantSettings,
} from "../../../../functions/src/types/settings";
import { parseISO } from "date-fns";
import { isEqual } from "lodash";

const getFormattedTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const OpeningHours = (_: RouteComponentProps) => {
  const response = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const settings = response?.data as unknown as RestaurantSettings;
  const loading = response?.isFetching || response?.isLoading || !response;
  const [localSettings, setLocalSettings] = useState<RestaurantSettings | null>(
    null
  );

  const hasChanges = !isEqual(settings, localSettings);

  React.useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleUpdateSettings = (
    updatedSettings: Partial<RestaurantSettings>
  ) => {
    if (!localSettings) return;

    const newSettings = {
      ...localSettings,
      ...updatedSettings,
    };

    setLocalSettings(newSettings);
  };

  const handleSaveChanges = () => {
    if (!localSettings || !hasChanges) return;

    updateSettingsMutation.mutate(localSettings);
  };

  if (loading || !localSettings) {
    return <div>Loading...</div>;
  }

  return (
    <Box display='flex' flexDirection='column' gap={3}>
      <Card>
        <CardContent>
          <Typography variant='h5' display='flex' alignItems='center' mb={2}>
            Opening Hours
          </Typography>
          <Typography component='div' mb={4}>
            Changes here will:
            <ul>
              <li>show up in our website</li>
              <li>
                be the limits for the reservation system (first reservation will
                be able to be made at the opening hour, last reservation will be
                able to be made at the closing hour minus the slot duration)
              </li>
            </ul>
          </Typography>

          {Object.keys(DayOfWeek).map((day) => (
            <Box
              key={day}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <Typography minWidth={100}>{day}</Typography>
              <TimePicker
                label='Start Time'
                value={parseISO(
                  `2024-01-01T${
                    localSettings?.openingDays[day as DayOfWeek].openingHours
                      .start || "09:00"
                  }`
                )}
                onChange={(newValue) => {
                  if (!newValue) return;

                  handleUpdateSettings({
                    openingDays: {
                      ...localSettings?.openingDays,
                      [day as DayOfWeek]: {
                        ...localSettings?.openingDays[day as DayOfWeek],
                        openingHours: {
                          ...localSettings?.openingDays[day as DayOfWeek]
                            .openingHours,
                          start: getFormattedTime(newValue),
                        },
                      },
                    },
                  });
                }}
              />
              <TimePicker
                label='End Time'
                value={parseISO(
                  `2024-01-01T${
                    localSettings?.openingDays[day as DayOfWeek].openingHours
                      .end || "17:00"
                  }`
                )}
                onChange={(newValue) => {
                  if (!newValue) return;

                  handleUpdateSettings({
                    openingDays: {
                      ...localSettings?.openingDays,
                      [day as DayOfWeek]: {
                        ...localSettings?.openingDays[day as DayOfWeek],
                        openingHours: {
                          ...localSettings?.openingDays[day as DayOfWeek]
                            .openingHours,
                          end: getFormattedTime(newValue),
                        },
                      },
                    },
                  });
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={
                      localSettings?.openingDays[day as DayOfWeek]?.isOpen ||
                      false
                    }
                    onChange={() => {
                      handleUpdateSettings({
                        openingDays: {
                          ...localSettings?.openingDays,
                          [day as DayOfWeek]: {
                            ...localSettings?.openingDays[day as DayOfWeek],
                            isOpen:
                              !localSettings?.openingDays[day as DayOfWeek]
                                ?.isOpen,
                          },
                        },
                      });
                    }}
                  />
                }
                label={
                  localSettings?.openingDays[day as DayOfWeek]?.isOpen
                    ? "Open"
                    : "Closed"
                }
              />
            </Box>
          ))}

          <Box display='flex' sx={{ mb: 2 }}>
            <Button
              sx={{ ml: "auto" }}
              variant='contained'
              color='primary'
              onClick={handleSaveChanges}
              disabled={updateSettingsMutation.isPending || !hasChanges}
            >
              {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OpeningHours;
