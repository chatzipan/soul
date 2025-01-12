import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Box, Typography, Card, CardContent } from "@mui/material";

const OtherSettings = (_: RouteComponentProps) => {
  return (
    <Box display='flex' flexDirection='column' gap={3}>
      <Card>
        <CardContent>
          <Typography variant='h5' display='flex' alignItems='center' mb={2}>
            Other Settings
          </Typography>
          {/* Add other settings content here */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OtherSettings;
