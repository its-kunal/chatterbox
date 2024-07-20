import { Box, CircularProgress } from "@mui/material";

export default function ChatLoader() {
  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}
