import React from "react";

import { Box, Typography } from "@mui/material";

import { ContactData } from "./BookingModal";
import * as S from "./BookingModal.styled";

export const ContactStep = ({
  contact,
  setContactData,
}: {
  contact: ContactData;
  setContactData: (contact: ContactData) => void;
}) => {
  const handleContactChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setContactData({ ...contact, [e.target.name]: e.target.value });
  };

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
          fullWidth
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
        />
        <S.TextArea
          id="outlined-multiline-static"
          placeholder="NOTES: Is there anything else we should know about your booking?"
          multiline
          sx={{ width: "100%" }}
          rows={2}
          fullWidth
          name="notes"
          value={contact.notes}
          onChange={handleContactChange}
        />
      </Box>
    </Box>
  );
};
