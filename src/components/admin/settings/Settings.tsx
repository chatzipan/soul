import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Link } from "gatsby";
import {
  Box,
  Typography,
  Card,
  CardContent,
  // Select,
  // MenuItem,
  TextField,
  FormControlLabel,
  // Button,
  // IconButton,
  Switch,
  Divider,
  Button,
} from "@mui/material";
import { /*DatePicker,*/ TimePicker } from "@mui/x-date-pickers";
// import DeleteIcon from "@mui/icons-material/Delete";
import { useSettings, useUpdateSettings } from "../../../hooks/useSettings";
import {
  /* BlockedDate, RecurringBlock,*/
  DayOfWeek,
  RestaurantSettings,
  TimeRange,
} from "../../../../functions/src/types/settings";
// import { v4 as uuidv4 } from "uuid";
import TuneIcon from "@mui/icons-material/Tune";
import { parseISO } from "date-fns";
import { isEqual } from "lodash";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonPinIcon from "@mui/icons-material/PersonPin";

// const defaultRecurringBlock: RecurringBlock = {
//   id: uuidv4(),
//   active: false,
//   timeRange: { start: "09:00", end: "17:00" },
//   dayOfWeek: 1,
// };

const getFormattedTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

interface LinkTabProps {
  label?: string;
  href?: string;
  selected?: boolean;
  icon?: any;
}

function samePageLinkNavigation(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component={Link}
      to={props.href || ""}
      iconPosition='end'
      icon={props.icon}
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      aria-current={props.selected && "page"}
      {...props}
    />
  );
}

const Settings = (_: RouteComponentProps) => {
  const response = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const settings = response?.data as unknown as RestaurantSettings;
  const loading = response?.isFetching || response?.isLoading || !response;
  const [localSettings, setLocalSettings] = useState<RestaurantSettings | null>(
    null
  );
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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

  // const handleAddRecurringBlock = () => {
  //   const newRecurringBlock: RecurringBlock = {
  //     id: uuidv4(),
  //     dayOfWeek: 0,
  //     timeRange: { start: "09:00", end: "17:00" },
  //     active: true,
  //   };

  //   updateSettingsMutation.mutate({
  //     recurringBlocks: [
  //       ...(settings?.recurringBlocks || []),
  //       newRecurringBlock,
  //     ],
  //   });
  // };

  // const handleUpdateBlockedDate = (updatedBlock: BlockedDate) => {
  //   const updatedBlocks = settings?.blockedDates.map((block) =>
  //     block.id === updatedBlock.id ? updatedBlock : block
  //   );
  //   updateSettingsMutation.mutate({ blockedDates: updatedBlocks });
  // };

  // const handleUpdateRecurringBlock = (updatedBlock: RecurringBlock) => {
  //   const updatedBlocks = settings?.recurringBlocks.map((block) =>
  //     block.id === updatedBlock.id ? updatedBlock : block
  //   );
  //   updateSettingsMutation.mutate({ recurringBlocks: updatedBlocks });
  // };

  // const handleDeleteBlockedDate = (id: string) => {
  //   const updatedBlocks = settings?.blockedDates.filter(
  //     (block) => block.id !== id
  //   );
  //   updateSettingsMutation.mutate({ blockedDates: updatedBlocks });
  // };

  // const handleDeleteRecurringBlock = (id: string) => {
  //   const updatedBlocks = settings?.recurringBlocks.filter(
  //     (block) => block.id !== id
  //   );
  //   updateSettingsMutation.mutate({ recurringBlocks: updatedBlocks });
  // };

  if (loading || !localSettings) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Typography variant='h3' sx={{ mb: 4 }}>
        <TuneIcon fontSize='large' />
        &nbsp;Settings
      </Typography>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label='icon position tabs example'
        role='navigation'
      >
        <LinkTab
          icon={<AccessTimeIcon />}
          label='Opening Hours'
          href='/opening-hours'
        />
        <LinkTab
          icon={<PersonPinIcon />}
          label='Other Settings'
          href='/other'
        />
      </Tabs>
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
                  be the limits for the reservation system (first reservation
                  will be able to be made at the opening hour, last reservation
                  will be able to be made at the closing hour minus the slot
                  duration)
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
                  label='Open'
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
                {updateSettingsMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />
            {/* <Typography variant='h6' gutterBottom>
              Slot Duration
            </Typography>
            <FormControlLabel
              control={
                <TextField
                  type='number'
                  size='small'
                  inputProps={{ min: 10, max: 60 }}
                  value={settings?.slotDuration}
                  onChange={(e) => {
                    handleUpdateSettings({
                      slotDuration: Number(e.target.value),
                    });
                  }}
                  sx={{ ml: 2, width: "80px" }}
                />
              }
              label='Slot Duration (minutes):'
              labelPlacement='start'
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
              Sitting Capacity
            </Typography>
            <FormControlLabel
              control={
                <TextField
                  type='number'
                  size='small'
                  inputProps={{ min: 10, max: 30 }}
                  value={settings?.maxCapacity || 20}
                  onChange={(e) => {
                    handleUpdateSettings({
                      maxCapacity: Number(e.target.value),
                    });
                  }}
                  sx={{ ml: 2, width: "80px" }}
                />
              }
              label='Maximum number of seats:'
              labelPlacement='start'
            /> */}
            {/* <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
              Recurring Blocked Times
            </Typography>
            {settings?.recurringBlocks?.map((block) => (
              <Box key={block.id} sx={{ mb: 2, display: "flex", gap: 2 }}>
                <Select
                  value={block.dayOfWeek}
                  onChange={(e) =>
                    handleUpdateRecurringBlock({
                      ...block,
                      dayOfWeek: Number(e.target.value),
                    })
                  }
                  size='small'
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <MenuItem key={day} value={index}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
                <TimePicker
                  label='Start Time'
                  value={block.timeRange.start}
                  onChange={(newValue) =>
                    handleUpdateRecurringBlock({
                      ...block,
                      timeRange: {
                        ...block.timeRange,
                        start: newValue || "09:00",
                      },
                    })
                  }
                />
                <TimePicker
                  label='End Time'
                  value={block.timeRange.end}
                  onChange={(newValue) =>
                    handleUpdateRecurringBlock({
                      ...block,
                      timeRange: {
                        ...block.timeRange,
                        end: newValue || "17:00",
                      },
                    })
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={block.active}
                      onChange={(e) =>
                        handleUpdateRecurringBlock({
                          ...block,
                          active: e.target.checked,
                        })
                      }
                    />
                  }
                  label='Active'
                />
                <IconButton
                  onClick={() => handleDeleteRecurringBlock(block.id)}
                  color='error'
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
              <Select
                value={DAYS_OF_WEEK[0]}
                onChange={(e) =>
                  handleUpdateRecurringBlock({
                    ...defaultRecurringBlock,
                    dayOfWeek: Number(e.target.value),
                  })
                }
                size='small'
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <MenuItem key={day} value={index}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
              <TimePicker
                label='Start Time'
                value=''
                onChange={(newValue) =>
                  handleUpdateRecurringBlock({
                    ...defaultRecurringBlock,
                    timeRange: {
                      ...defaultRecurringBlock.timeRange,
                      start: newValue || "09:00",
                    },
                  })
                }
              />
              <TimePicker
                value=''
                onChange={(newValue) =>
                  handleUpdateRecurringBlock({
                    ...defaultRecurringBlock,
                    timeRange: {
                      ...defaultRecurringBlock.timeRange,
                      end: newValue || "17:00",
                    },
                  })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={false}
                    onChange={(e) =>
                      handleUpdateRecurringBlock({
                        ...defaultRecurringBlock,
                        active: e.target.checked,
                      })
                    }
                  />
                }
                label='Active'
              />
              <IconButton
                onClick={() =>
                  handleDeleteRecurringBlock(defaultRecurringBlock.id)
                }
                color='error'
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Button
              variant='outlined'
              onClick={handleAddRecurringBlock}
              sx={{ mt: 2 }}
            >
              Add Recurring Block
            </Button>
            <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
              Blocked Dates
            </Typography>
            {settings?.blockedDates?.map((block) => (
              <Box key={block.id} sx={{ mb: 2, display: "flex", gap: 2 }}>
                <DatePicker
                  label='Date'
                  value={block.date}
                  onChange={(newValue) =>
                    handleUpdateBlockedDate({
                      ...block,
                      date: newValue?.getTime() || new Date().getTime(),
                    })
                  }
                />
                <TimePicker
                  label='Start Time'
                  value={block.timeRange?.start}
                  onChange={(newValue) =>
                    handleUpdateBlockedDate({
                      ...block,
                      timeRange: {
                        ...block.timeRange,
                        start: newValue || "09:00",
                      },
                    })
                  }
                />
                <TimePicker
                  label='End Time'
                  value={block.timeRange?.end}
                  onChange={(newValue) =>
                    handleUpdateBlockedDate({
                      ...block,
                      timeRange: {
                        ...block.timeRange,
                        end: newValue || "17:00",
                      },
                    })
                  }
                />
                <TextField
                  label='Reason'
                  value={block.reason || ""}
                  onChange={(e) =>
                    handleUpdateBlockedDate({
                      ...block,
                      reason: e.target.value,
                    })
                  }
                  size='small'
                />
                <IconButton
                  onClick={() => handleDeleteBlockedDate(block.id)}
                  color='error'
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant='outlined'
              onClick={handleAddBlockedDate}
              sx={{ mt: 2 }}
            >
              Add Blocked Date
            </Button> */}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Settings;
