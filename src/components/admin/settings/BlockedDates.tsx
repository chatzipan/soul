import React, { useState } from "react";

import { isEqual } from "lodash";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { RouteComponentProps } from "@reach/router";
import { parseISO } from "date-fns";
import { format } from "date-fns";

import { Reservation } from "../../../../functions/src/types/reservation";
import {
  DayOfWeek,
  RecurringBlock,
  RestaurantSettings,
  SingleBlock,
} from "../../../../functions/src/types/settings";
import { useEvents } from "../../../hooks/useEvents";
import { useSettings, useUpdateSettings } from "../../../hooks/useSettings";
import { getFormattedTime } from "../reservations/utils";
import { SORTED_DAYS } from "./OpeningHours";
import {
  areBlocksOutsideHours,
  areBlocksOverlapping,
  getAvailableTimeSlots,
  getTimeConstraints,
} from "./utils";

const BlockedDates = (_: RouteComponentProps) => {
  const response = useSettings();
  const eventsResponse = useEvents();
  const updateSettingsMutation = useUpdateSettings();
  const settings = response?.data as unknown as RestaurantSettings;
  const events = eventsResponse?.data as unknown as Reservation[];
  const loading =
    response?.isFetching ||
    response?.isLoading ||
    !response ||
    eventsResponse?.isLoading;

  const [localSettings, setLocalSettings] = useState<RestaurantSettings>({
    ...settings,
    recurringBlocks: [],
    singleBlocks: [],
  });

  const hasChanges = !isEqual(settings, localSettings);

  React.useEffect(() => {
    if (settings) {
      setLocalSettings({
        ...settings,
        recurringBlocks: settings.recurringBlocks ?? [],
        singleBlocks: settings.singleBlocks ?? [],
      });
    }
  }, [settings]);

  const handleUpdateSettings = (
    updatedSettings: Partial<RestaurantSettings>,
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

  const addRecurringBlock = () => {
    if (!localSettings) return;

    const defaultDay = DayOfWeek.Monday;

    // Get the first available time slot for Monday
    const availableSlots = getAvailableTimeSlots(
      localSettings.recurringBlocks.filter(
        (block) => block.dayOfWeek === defaultDay,
      ),
      null,
      defaultDay,
      localSettings,
    );

    let start: string | null = null;
    let end: string | null = null;

    if (availableSlots.length > 0) {
      const slot = availableSlots[0];
      const nextFreeHour = new Date(slot.minTime.getTime());
      nextFreeHour.setHours(nextFreeHour.getHours() + 1);
      const adjustedEnd =
        nextFreeHour <= slot.maxTime ? nextFreeHour : slot.maxTime;

      start = getFormattedTime(slot.minTime);
      end = getFormattedTime(adjustedEnd);
    }

    // Fallback defaults if no available slots
    const newBlock: RecurringBlock = {
      dayOfWeek: defaultDay,
      start: start ?? "09:00",
      end: end ?? "10:00",
    };

    handleUpdateSettings({
      recurringBlocks: [...localSettings.recurringBlocks, newBlock],
    });
  };

  const addSingleBlock = () => {
    if (!localSettings) return;

    const newBlock: SingleBlock = {
      date: new Date().getTime(),
      start: "09:00",
      end: "17:00",
    };

    handleUpdateSettings({
      singleBlocks: [...(localSettings.singleBlocks || []), newBlock],
    });
  };

  const deleteRecurringBlock = (index: number) => {
    if (!localSettings) return;

    const newBlocks = [...localSettings.recurringBlocks];
    newBlocks.splice(index, 1);
    handleUpdateSettings({ recurringBlocks: newBlocks });
  };

  const deleteSingleBlock = (index: number) => {
    if (!localSettings) return;

    const newBlocks = [...(localSettings.singleBlocks || [])];
    newBlocks.splice(index, 1);
    handleUpdateSettings({ singleBlocks: newBlocks });
  };

  if (loading || !localSettings) {
    return <CircularProgress sx={{ mt: 2, ml: "auto", mr: "auto" }} />;
  }

  const disableSave =
    areBlocksOutsideHours(localSettings.recurringBlocks, localSettings) ||
    areBlocksOverlapping(localSettings.recurringBlocks);

  const blockedEvents =
    events?.filter(
      (event) => event.disableParallelBookings && !event.canceled,
    ) || [];

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {blockedEvents.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Events that block Reservations
            </Typography>
            {blockedEvents.map((event) => (
              <Box
                key={event.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Typography>
                  {format(new Date(event.date), "dd.MM.yyyy")} {event.time}{" "}
                  -&nbsp;
                  {event.eventTitle || `${event.firstName} ${event.lastName}`}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recurring Blocks&nbsp;
            <small style={{ fontSize: "0.8em" }}>
              (blocks that repeat every week)
            </small>
          </Typography>
          {localSettings.recurringBlocks.map((block, index) => {
            const { minTime, maxTime } = getTimeConstraints(
              localSettings,
              block.dayOfWeek,
            );

            const availableSlots = getAvailableTimeSlots(
              localSettings.recurringBlocks
                .filter((_, i) => i !== index)
                .filter((b) => b.dayOfWeek === block.dayOfWeek),
              null,
              block.dayOfWeek,
              localSettings,
            );

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  gap: 2,
                  mb: { xs: 4, md: 2 },
                }}
              >
                <Select
                  value={block.dayOfWeek}
                  sx={{ width: { xs: "100%", md: 135 } }}
                  onChange={(e) => {
                    const newBlocks = [...localSettings.recurringBlocks];
                    newBlocks[index] = {
                      ...block,
                      dayOfWeek: e.target.value as DayOfWeek,
                    };
                    handleUpdateSettings({ recurringBlocks: newBlocks });
                  }}
                >
                  {SORTED_DAYS.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
                <TimePicker
                  label="Start Time"
                  value={parseISO(`2024-01-01T${block.start}`)}
                  disabled={!block.dayOfWeek}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const newBlocks = [...localSettings.recurringBlocks];
                    newBlocks[index] = {
                      ...block,
                      start: getFormattedTime(newValue),
                    };
                    handleUpdateSettings({ recurringBlocks: newBlocks });
                  }}
                  shouldDisableTime={(timeValue) => {
                    if (!block.start) return false;

                    return !availableSlots.some(
                      (slot) =>
                        timeValue >= slot.minTime && timeValue <= slot.maxTime,
                    );
                  }}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                <TimePicker
                  label="End Time"
                  value={parseISO(`2024-01-01T${block.end}`)}
                  disabled={!block.start}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const newBlocks = [...localSettings.recurringBlocks];
                    newBlocks[index] = {
                      ...block,
                      end: getFormattedTime(newValue),
                    };
                    handleUpdateSettings({ recurringBlocks: newBlocks });
                  }}
                  shouldDisableTime={(timeValue) => {
                    if (!block.start || !block.end) return false;
                    const startTime = parseISO(`2024-01-01T${block.start}`);
                    return (
                      timeValue <= startTime ||
                      !availableSlots.some(
                        (slot) =>
                          timeValue >= slot.minTime &&
                          timeValue <= slot.maxTime,
                      )
                    );
                  }}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                <IconButton
                  color="error"
                  onClick={() => deleteRecurringBlock(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={addRecurringBlock}
          >
            Add Recurring Block
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Single Date Blocks&nbsp;
            <small style={{ fontSize: "0.8em" }}>
              (blocks that only apply to a single date)
            </small>
          </Typography>
          {(localSettings.singleBlocks || []).map((block, index) => {
            const date = new Date(block.date);
            const { minTime, maxTime } = getTimeConstraints(
              localSettings,
              undefined,
              date,
            );

            const availableSlots = getAvailableTimeSlots(
              (localSettings.singleBlocks || []).filter((_, i) => i !== index),
              date,
              undefined,
              localSettings,
            );

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  gap: 2,
                  mb: { xs: 4, md: 2 },
                }}
              >
                <DatePicker
                  disablePast
                  label="Date"
                  sx={{ width: { xs: "100%", md: "auto" } }}
                  value={date}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const newBlocks = [...(localSettings.singleBlocks || [])];
                    newBlocks[index] = {
                      ...block,
                      date: newValue.getTime(),
                    };
                    handleUpdateSettings({ singleBlocks: newBlocks });
                  }}
                />
                <TimePicker
                  label="Start Time"
                  value={parseISO(`2024-01-01T${block.start}`)}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const newBlocks = [...(localSettings.singleBlocks || [])];
                    newBlocks[index] = {
                      ...block,
                      start: getFormattedTime(newValue),
                    };
                    handleUpdateSettings({ singleBlocks: newBlocks });
                  }}
                  shouldDisableTime={(timeValue) =>
                    !availableSlots.some(
                      (slot) =>
                        timeValue >= slot.minTime && timeValue <= slot.maxTime,
                    )
                  }
                  minTime={minTime}
                  maxTime={maxTime}
                />
                <TimePicker
                  label="End Time"
                  value={parseISO(`2024-01-01T${block.end}`)}
                  sx={{ width: { xs: "100%", md: "auto" } }}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const newBlocks = [...(localSettings.singleBlocks || [])];
                    newBlocks[index] = {
                      ...block,
                      end: getFormattedTime(newValue),
                    };
                    handleUpdateSettings({ singleBlocks: newBlocks });
                  }}
                  shouldDisableTime={(timeValue) => {
                    const startTime = parseISO(`2024-01-01T${block.start}`);
                    return (
                      timeValue <= startTime ||
                      !availableSlots.some(
                        (slot) =>
                          timeValue >= slot.minTime &&
                          timeValue <= slot.maxTime,
                      )
                    );
                  }}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                <IconButton
                  color="error"
                  onClick={() => deleteSingleBlock(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={addSingleBlock}
          >
            Add Single Block
          </Button>
        </CardContent>
      </Card>

      <Box display="flex">
        <Button
          sx={{ ml: "auto" }}
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          disabled={
            updateSettingsMutation.isPending || !hasChanges || disableSave
          }
        >
          {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default BlockedDates;
