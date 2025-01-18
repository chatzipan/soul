import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSettings, useUpdateSettings } from "../../../hooks/useSettings";
import {
  DayOfWeek,
  RestaurantSettings,
  RecurringBlock,
  SingleBlock,
  TimeBlock,
} from "../../../../functions/src/types/settings";
import { parseISO } from "date-fns";
import { isEqual } from "lodash";
import { getFormattedTime } from "../reservations/utils";
import { useEvents } from "../../../hooks/useEvents";
import { Reservation } from "../../../../functions/src/types/reservation";
import { format } from "date-fns";

const getTimeConstraints = (
  settings: RestaurantSettings,
  dayOfWeek?: DayOfWeek,
  date?: Date
) => {
  const day: DayOfWeek = date
    ? Object.values(DayOfWeek)[date.getDay()]
    : DayOfWeek.Friday;

  const openingHours = dayOfWeek
    ? settings.openingDays[dayOfWeek]?.openingHours
    : (settings.openingDays[day]?.openingHours as TimeBlock);

  return {
    minTime: parseISO(`2024-01-01T${openingHours.start}`),
    maxTime: parseISO(`2024-01-01T${openingHours.end}`),
  };
};

const getAvailableTimeSlots = (
  blocks: (RecurringBlock | SingleBlock)[],
  date: Date | null,
  dayOfWeek: DayOfWeek | undefined,
  settings: RestaurantSettings
): { minTime: Date; maxTime: Date }[] => {
  const baseConstraints = getTimeConstraints(settings, dayOfWeek, date);
  const startOfDay = baseConstraints.minTime;
  const endOfDay = baseConstraints.maxTime;

  // If no blocks exist, return the full day
  if (!blocks.length) {
    return [{ minTime: startOfDay, maxTime: endOfDay }];
  }

  // Sort blocks by start time
  const sortedBlocks = [...blocks].sort((a, b) => {
    const aTime = parseISO(`2024-01-01T${a.start}`);
    const bTime = parseISO(`2024-01-01T${b.start}`);
    return aTime.getTime() - bTime.getTime();
  });

  const availableSlots: { minTime: Date; maxTime: Date }[] = [];
  let currentTime = startOfDay;

  sortedBlocks.forEach((block) => {
    const blockStart = parseISO(`2024-01-01T${block.start}`);
    const blockEnd = parseISO(`2024-01-01T${block.end}`);

    // Add slot before current block if there's space
    if (currentTime < blockStart) {
      availableSlots.push({
        minTime: currentTime,
        maxTime: blockStart,
      });
    }
    currentTime = blockEnd;
  });

  // Add final slot after last block if there's space
  if (currentTime < endOfDay) {
    availableSlots.push({
      minTime: currentTime,
      maxTime: endOfDay,
    });
  }

  return availableSlots;
};

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

  const addRecurringBlock = () => {
    if (!localSettings) return;

    const newBlock: RecurringBlock = {
      dayOfWeek: DayOfWeek.Monday,
      start: "12:00",
      end: "17:00",
    };

    handleUpdateSettings({
      recurringBlocks: [...(localSettings.recurringBlocks || []), newBlock],
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

    const newBlocks = [...(localSettings.recurringBlocks || [])];
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

  const blockedEvents =
    events?.filter(
      (event) => event.disableParallelBookings && !event.canceled
    ) || [];

  return (
    <Box display='flex' flexDirection='column' gap={3}>
      {blockedEvents.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Events Blocking Reservations
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
                  {format(new Date(event.date), "dd.MM.yyyy")} {event.time} -{" "}
                  {event.eventTitle || `${event.firstName} ${event.lastName}`}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Recurring Blocks
          </Typography>
          {(localSettings.recurringBlocks || []).map((block, index) => {
            const { minTime, maxTime } = getTimeConstraints(
              localSettings,
              block.dayOfWeek
            );

            const availableSlots = getAvailableTimeSlots(
              (localSettings.recurringBlocks || []).filter(
                (_, i) => i !== index
              ),
              null,
              block.dayOfWeek,
              localSettings
            );

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Select
                  value={block.dayOfWeek}
                  onChange={(e) => {
                    const newBlocks = [
                      ...(localSettings.recurringBlocks || []),
                    ];
                    newBlocks[index] = {
                      ...block,
                      dayOfWeek: e.target.value as DayOfWeek,
                    };
                    handleUpdateSettings({ recurringBlocks: newBlocks });
                  }}
                >
                  {Object.values(DayOfWeek).map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
                <TimePicker
                  label='Start Time'
                  value={parseISO(`2024-01-01T${block.start}`)}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const newBlocks = [
                      ...(localSettings.recurringBlocks || []),
                    ];
                    newBlocks[index] = {
                      ...block,
                      start: getFormattedTime(newValue),
                    };
                    handleUpdateSettings({ recurringBlocks: newBlocks });
                  }}
                  shouldDisableTime={(timeValue) => {
                    return !availableSlots.some(
                      (slot) =>
                        timeValue >= slot.minTime && timeValue <= slot.maxTime
                    );
                  }}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                <TimePicker
                  label='End Time'
                  value={parseISO(`2024-01-01T${block.end}`)}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const newBlocks = [
                      ...(localSettings.recurringBlocks || []),
                    ];
                    newBlocks[index] = {
                      ...block,
                      end: getFormattedTime(newValue),
                    };
                    handleUpdateSettings({ recurringBlocks: newBlocks });
                  }}
                  shouldDisableTime={(timeValue) => {
                    const startTime = parseISO(`2024-01-01T${block.start}`);
                    return (
                      timeValue <= startTime ||
                      !availableSlots.some(
                        (slot) =>
                          timeValue >= slot.minTime && timeValue <= slot.maxTime
                      )
                    );
                  }}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                <IconButton
                  color='error'
                  onClick={() => deleteRecurringBlock(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
          <Button
            startIcon={<AddIcon />}
            variant='outlined'
            onClick={addRecurringBlock}
          >
            Add Recurring Block
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Single Date Blocks
          </Typography>
          {(localSettings.singleBlocks || []).map((block, index) => {
            const date = new Date(block.date);
            const { minTime, maxTime } = getTimeConstraints(
              localSettings,
              undefined,
              date
            );

            const availableSlots = getAvailableTimeSlots(
              (localSettings.singleBlocks || []).filter((_, i) => i !== index),
              date,
              undefined,
              localSettings
            );

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <DatePicker
                  label='Date'
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
                  label='Start Time'
                  value={parseISO(`2024-01-01T${block.start}`)}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    const newBlocks = [...(localSettings.singleBlocks || [])];
                    newBlocks[index] = {
                      ...block,
                      start: getFormattedTime(newValue),
                    };
                    handleUpdateSettings({ singleBlocks: newBlocks });
                  }}
                  shouldDisableTime={(timeValue) => {
                    return !availableSlots.some(
                      (slot) =>
                        timeValue >= slot.minTime && timeValue <= slot.maxTime
                    );
                  }}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                <TimePicker
                  label='End Time'
                  value={parseISO(`2024-01-01T${block.end}`)}
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
                          timeValue >= slot.minTime && timeValue <= slot.maxTime
                      )
                    );
                  }}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                <IconButton
                  color='error'
                  onClick={() => deleteSingleBlock(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
          <Button
            startIcon={<AddIcon />}
            variant='outlined'
            onClick={addSingleBlock}
          >
            Add Single Block
          </Button>
        </CardContent>
      </Card>

      <Box display='flex'>
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

export default BlockedDates;
