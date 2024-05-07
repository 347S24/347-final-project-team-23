import React from "react";
import { Alert } from "@mui/material";

// Custom alert card component using MUI Alert
function ChangeAlertCard({ type, count }) {
  let severity;
  let changeTypeText;

  switch (type) {
    case "added":
      severity = "success"; // Green for additions
      changeTypeText = "Addition";
      break;
    case "removed":
      severity = "error"; // Red for removals
      changeTypeText = "Removal";
      break;
    case "reordered":
      severity = "warning"; // Yellow for modifications
      changeTypeText = "shift";
      break;
    default:
      severity = "info"; // Blue for general info
      changeTypeText = "Changed";
  }

  if (count > 0) {
    return (
      <Alert variant="outlined" severity={severity} sx={{ margin: 1 }}>
        {count} {changeTypeText}
        {count > 1 ? "s" : ""}
      </Alert>
    );
  }

  return null;
}

export default ChangeAlertCard;
