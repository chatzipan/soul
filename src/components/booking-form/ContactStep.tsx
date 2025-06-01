import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import * as S from "./BookingForm.styled";
import { ContactData } from "./types";

export const ContactStep = ({
  contact,
  isEditMode,
  isPending,
  setContactData,
}: {
  contact: ContactData;
  isEditMode: boolean;
  isPending: boolean;
  setContactData: (contact: ContactData) => void;
}) => {
  const handleContactChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setContactData({ ...contact, [e.target.name]: e.target.value });
  };

  if (isPending) {
    return (
      <Box display="flex">
        <Box display="flex" flexDirection="column" width="100%">
          <CircularProgress sx={{ margin: "0 auto" }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" width="100%">
        <Typography variant="h6" gutterBottom>
          Your Contact Details
        </Typography>
        <S.TextField
          id="outlined-basic"
          label="First Name *"
          name="firstName"
          value={contact.firstName}
          onChange={handleContactChange}
          variant="outlined"
          sx={{ mb: 2, width: "100%" }}
          inputProps={{ maxLength: 24 }}
          fullWidth
          disabled={isEditMode}
        />
        <S.TextField
          id="outlined-basic"
          label="Last Name *"
          name="lastName"
          value={contact.lastName}
          onChange={handleContactChange}
          variant="outlined"
          sx={{ mb: 2, width: "100%" }}
          fullWidth
          inputProps={{ maxLength: 24 }}
          disabled={isEditMode}
        />
        <S.TextField
          id="outlined-basic"
          label="Email *"
          type="email"
          name="email"
          value={contact.email}
          sx={{ mb: 2, width: "100%" }}
          onChange={handleContactChange}
          variant="outlined"
          fullWidth
          disabled={isEditMode}
        />
        <S.TelInput
          id="outlined-basic"
          name="telephone"
          value={contact.telephone}
          onChange={(telephone) => setContactData({ ...contact, telephone })}
          label="Telephone *"
          sx={{ mb: 2, width: "100%", mt: 1 }}
          variant="outlined"
          defaultCountry="CH"
          fullWidth
          inputProps={{ maxLength: 24 }}
          disabled={isEditMode}
        />
        <S.TextArea
          id="outlined-multiline-static"
          placeholder="NOTES: Is there anything else we should know about your booking?"
          multiline
          sx={{ width: "100%" }}
          rows={2}
          maxRows={4}
          fullWidth
          name="notes"
          value={contact.notes}
          onChange={handleContactChange}
          inputProps={{ maxLength: 120 }}
        />
      </Box>
    </Box>
  );
};
