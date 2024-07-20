import { Box, Button, IconButton, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import socket from "../../api/socket";

// TODO:
/*
 Implement Limit size for a media file.
*/

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
  const [base64Image, setBase64Image] = useState("");

  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.files && event.target.files[0].size > 1e7) {
      alert("File size too large");
      return;
    }
    const reader = new FileReader();
    event.target.files && reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = (e) =>
      e.target?.result && setBase64Image(e.target.result as string);
    reader.addEventListener("loadend", () => {
      console.log("Hey");
      socket.emit(
        "message:send2",
        JSON.stringify({ data: reader.result as string, kind: "image" })
      );
      // setBase64Image(reader.result as string);
    });
  };

  // useEffect(() => {
  //   socket.connect();
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    if (base64Image !== "") {
      socket.emit(
        "message:send2",
        JSON.stringify({ data: base64Image, kind: "image" })
      );
      setBase64Image("");
    }
  }, [base64Image]);

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
