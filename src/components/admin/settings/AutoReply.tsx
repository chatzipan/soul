import React, { useState } from "react";

import { format } from "date-fns";
import { isEqual } from "lodash";

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { RouteComponentProps } from "@reach/router";

import { AutoReplySettings } from "../../../../functions/src/types/autoReply";
import {
  useAutoReplySettings,
  useUpdateAutoReplySettings,
} from "../../../hooks/useAutoReplySettings";

const formatDate = (value: number | null) =>
  value === null ? "not set" : format(new Date(value), "d MMM yyyy, HH:mm");

const AutoReply = (_: RouteComponentProps) => {
  const response = useAutoReplySettings();
  const updateMutation = useUpdateAutoReplySettings();
  const settings = response?.data as unknown as AutoReplySettings;
  const loading = response?.isFetching || response?.isLoading || !response;
  const [localSettings, setLocalSettings] = useState<AutoReplySettings | null>(
    null,
  );

  const hasChanges = !isEqual(settings, localSettings);

  React.useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleUpdate = (updated: Partial<AutoReplySettings>) => {
    if (!localSettings) return;
    setLocalSettings({ ...localSettings, ...updated });
  };

  const handleSaveChanges = () => {
    if (!localSettings || !hasChanges) return;
    updateMutation.mutate(localSettings);
  };

  if (loading || !localSettings) {
    return <CircularProgress sx={{ mt: 2, ml: "auto", mr: "auto" }} />;
  }

  // The saved state, not the unsaved one. Otherwise flicking a switch would
  // claim the job changed before anything was written.
  const isOff = !settings.enabled;
  const isDryRun = settings.enabled && settings.dryRun;
  const isLive = settings.enabled && !settings.dryRun;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Alert severity={isOff ? "warning" : isDryRun ? "info" : "success"}>
        <AlertTitle>
          {isOff && "The job is off"}
          {isDryRun && "Dry run"}
          {isLive && "Live"}
        </AlertTitle>
        {isOff &&
          "No weekend emails are being answered. Everything waits for a person."}
        {isDryRun &&
          "The job reads mail and writes down what it would do. It sends nothing."}
        {isLive &&
          "The job is answering customers by itself. Every reply is copied to hallo@soulzuerich.ch."}
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Run the job
          </Typography>
          <Typography component="div" mb={3}>
            Turn this off to stop everything at once. No deploy is needed, and
            it takes effect on the next run, within 15 minutes. Use this first
            if something looks wrong.
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.enabled}
                onChange={(e) => handleUpdate({ enabled: e.target.checked })}
              />
            }
            label={localSettings.enabled ? "On" : "Off"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Dry run
          </Typography>
          <Typography component="div" mb={3}>
            The job does every step except sending. It still writes a record for
            each email, so you can read its decisions before trusting it. Leave
            this on until the records look right.
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.dryRun}
                onChange={(e) => handleUpdate({ dryRun: e.target.checked })}
              />
            }
            label={
              localSettings.dryRun ? "On, nothing is sent" : "Off, mail is sent"
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Go-live floor
          </Typography>
          <Typography component="div" mb={3}>
            Email that arrived before this moment is never answered. Set it to
            now just before you turn the dry run off, so the first live run does
            not reply to old mail.
          </Typography>
          <Typography component="div" mb={3}>
            <strong>Currently: {formatDate(localSettings.goLiveDate)}</strong>
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              onClick={() => handleUpdate({ goLiveDate: Date.now() })}
            >
              Set to now
            </Button>
            <Button
              variant="outlined"
              color="warning"
              disabled={localSettings.goLiveDate === null}
              onClick={() => handleUpdate({ goLiveDate: null })}
            >
              Clear
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Event cutoff
          </Typography>
          <Typography component="div" mb={3}>
            On a weekend, an enquiry about an event at or after this hour is
            left for a person. So is any booking for 10 people or more. Earlier
            than this, the job answers by itself. This hour is never written in
            a reply and never shown on the website.
          </Typography>
          <TextField
            type="number"
            label="Hour (0 to 23)"
            value={localSettings.eventCutoffHour}
            onChange={(e) =>
              handleUpdate({ eventCutoffHour: parseInt(e.target.value) })
            }
            inputProps={{ min: 0, max: 23, step: 1 }}
            sx={{ width: { xs: "100%", md: "200px" } }}
          />
        </CardContent>
      </Card>

      <Box display="flex" sx={{ mb: 2 }}>
        <Button
          sx={{ ml: "auto" }}
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          disabled={updateMutation.isPending || !hasChanges}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default AutoReply;
