import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSettings, useUpdateSettings } from "../../../hooks/useSettings";
import { RestaurantSettings } from "../../../../functions/src/types/settings";
import { isEqual } from "lodash";

const RestaurantData = (_: RouteComponentProps) => {
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
    return <CircularProgress sx={{ mt: 2, ml: "auto", mr: "auto" }} />;
  }

  return (
    <Box display='flex' flexDirection='column' gap={3}>
      <Card>
        <CardContent>
          <Typography variant='h5' display='flex' alignItems='center' mb={2}>
            Time Slot Duration
          </Typography>
          <Typography component='div' mb={4}>
            This setting determines the duration of each reservation slot in
            minutes. This affects how reservations can be made and their
            spacing.
          </Typography>
          <TextField
            type='number'
            label='Duration (minutes)'
            value={localSettings.timeSlotDuration}
            onChange={(e) =>
              handleUpdateSettings({
                timeSlotDuration: parseInt(e.target.value),
              })
            }
            inputProps={{ min: 30, max: 240, step: 5 }}
            sx={{ width: { xs: "100%", md: "200px" } }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant='h5' display='flex' alignItems='center' mb={2}>
            Maximum Capacity
          </Typography>
          <Typography component='div' mb={4}>
            Set the maximum number of guests that can have a reservation at
            once. This helps prevent overbooking.
          </Typography>
          <TextField
            type='number'
            label='Max Capacity'
            value={localSettings.maxCapacity || 100}
            onChange={(e) =>
              handleUpdateSettings({
                maxCapacity: parseInt(e.target.value),
              })
            }
            inputProps={{ min: 1, max: 200 }}
            sx={{ width: { xs: "100%", md: "200px" } }}
          />
        </CardContent>
      </Card>

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
    </Box>
  );
};

export default RestaurantData;
