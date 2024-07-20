import { IconButton, styled } from "@mui/material";
import React from "react";
import ImageIcon from "@mui/icons-material/Image";
import { useChatContext } from "./ChatContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function ImageUpload() {
  const { setImageContent } = useChatContext();

  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    // @ts-ignore
    let file: any = event.currentTarget.files[0];
    if (file.size > 1e7) {
      alert("File size too large");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageContent(reader.result as string);
    };
  };

  return (
    <IconButton component="label" sx={{ position: "relative" }} color="primary">
      <ImageIcon />
      <VisuallyHiddenInput
        type="file"
        onChange={handleImageUpload}
        accept="image/*"
      />
    </IconButton>
  );
}

export default ImageUpload;
