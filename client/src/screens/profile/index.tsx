import { Box, Container, IconButton, Typography } from "@mui/material";
import { useFirebaseAuth } from "../../firebase/authContext";
import { createAvatar } from "@dicebear/core";
import { thumbs } from "@dicebear/collection";
import slug from "slug";
import { Edit } from "@mui/icons-material";

export default function ProfileScreen() {
  const { user } = useFirebaseAuth();

  if (!user) return null;

  return (
    <Container sx={{ mt: 2 }}>
      {/* section for user avatar and name */}
      <Box
        sx={{
          display: "flex",
          columnGap: 2,
          rowGap: 2,
          alignItems: "start",
          width: "100%",
        }}
      >
        <Box
          sx={{
            height: { xs: 75, md: 100 },
            borderRadius: "100%",
            border: 1,
            aspectRatio: 1,
          }}
        >
          {(() => {
            const avatarUri = createAvatar(thumbs, {
              seed: user.displayName || "",
            }).toDataUri();
            return (
              <img
                src={avatarUri}
                height={"100%"}
                width={"100%"}
                style={{ aspectRatio: 1, borderRadius: "100%" }}
              />
            );
          })()}
        </Box>
        <Box sx={{ display: "flex", rowGap: 1, flexDirection: "column" }}>
          <Typography variant="h3" sx={{ fontSize: { xs: 24, md: 32 } }}>
            {user.displayName}
          </Typography>
          <Container
            sx={(theme) => ({
              backgroundColor: theme.palette.grey[100],
              borderRadius: theme.shape.borderRadius,
              py: 0.5,
              width: "100%",
            })}
          >
            <Typography>{slug(user.displayName || "")}</Typography>
          </Container>
        </Box>
        <Box>
          <IconButton color="primary">
            <Edit />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
}
