import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import React, { useEffect, useRef, useState } from "react";
import { Close, FastForward, Pause, Save, Stop } from "@mui/icons-material";
import { useChatContext } from "./ChatContext";

interface AudioRecorderProps {}

interface AudioRecorderState {
  menuOpen: boolean;
  permission: boolean;
  recordingStatus: "inactive" | "recording" | "paused";
  stream?: MediaStream;
  audioChunks: Blob[];
  audio?: string; // URL of the recorded audio,
  audioUrl: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = () => {
  const { setAudioContent, audioContent } = useChatContext();
  const [state, setState] = useState<AudioRecorderState>({
    menuOpen: false,
    permission: false,
    recordingStatus: "inactive",
    stream: undefined,
    audioChunks: [],
    audio: audioContent === null ? undefined : audioContent,
    audioUrl: "",
  });
  const theme = useTheme();

  const mimeType = "audio/webm";
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setState((prevState) => ({
          ...prevState,
          permission: true,
          stream: streamData,
        }));
      } catch (err: any) {
        alert(err.message);
        throw err;
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
      throw new Error("API not available in your browser.");
    }
  };

  const startRecording = async () => {
    if (!state.permission) {
      try {
        getMicrophonePermission();
        if (state.permission) startRecording();
      } catch (error: any) {
        return;
      }
    } else {
      setState((prevState) => ({ ...prevState, recordingStatus: "recording" }));

      // Create new MediaRecorder instance using the stream
      const options: MediaRecorderOptions = {
        mimeType: mimeType,
      };
      const media = new MediaRecorder(state.stream!, options);
      mediaRecorder.current = media;

      // Start the recording process
      mediaRecorder.current.start();

      let localAudioChunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (event) => {
        if (!event.data || event.data.size === 0) return;
        localAudioChunks.push(event.data);
      };
      setState((prevState) => ({
        ...prevState,
        audioChunks: localAudioChunks,
      }));
    }
  };

  const stopRecording = () => {
    setState((prevState) => ({ ...prevState, recordingStatus: "inactive" }));

    // Stop the recording instance
    mediaRecorder.current?.stop();

    if (mediaRecorder.current) {
      mediaRecorder.current.onstop = async () => {
        // Create a blob file from the audiochunks data
        const audioBlob = new Blob(state.audioChunks, { type: mimeType });
        // Create a playable URL from the blob file
        const audioUrl = URL.createObjectURL(audioBlob);
        const reader = new FileReader();
        reader.onloadend = () => {
          const audioText =
            reader.result && (reader.result as string).split(",")[1];
          setState((prevState) => ({
            ...prevState,
            audioUrl: audioUrl,
            audio: audioText || "",
            audioChunks: [],
          }));
        };
        reader.readAsDataURL(audioBlob);
      };
    }
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setState((prevState) => ({ ...prevState, menuOpen: true }));
  };

  const handleClose = () => {
    setState((prevState) => ({ ...prevState, menuOpen: false }));
  };

  const pauseRecording = () => {
    if (state.recordingStatus === "recording") {
      setState((prevState) => ({ ...prevState, recordingStatus: "paused" }));
      mediaRecorder.current?.pause(); // Pause if recording
    }
  };

  const resumeRecording = () => {
    if (state.recordingStatus === "paused") {
      setState((prevState) => ({ ...prevState, recordingStatus: "recording" }));
      mediaRecorder.current?.resume(); // Resume if paused
    }
  };

  const handleSubmit = () => {
    if (state.audio === undefined) {
      alert("Please record your sweet voice, then click submit.");
      return;
    }
    setAudioContent(state.audio);
    handleClose();
  };

  useEffect(() => {
    try {
      getMicrophonePermission();
    } catch {}
  }, []);

  useEffect(() => {
    if (audioContent) {
      const audioBlob = new Blob([audioContent], { type: mimeType });
      console.log(audioBlob);
      const audioURL = URL.createObjectURL(audioBlob);
      console.log(audioURL);
      setState((prevState) => ({ ...prevState, audioUrl: audioURL }));
    }
  }, []);

  return (
    <>
      <IconButton onClick={handleClick}>
        <KeyboardVoiceIcon color="primary" />
      </IconButton>
      <Modal open={state.menuOpen} onClose={handleClose}>
        <Paper
          sx={{
            p: 2,
            mt: 10,
            maxWidth: theme.breakpoints.values.sm,
            marginX: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Record your voice</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", columnGap: 2, alignItems: "center" }}>
            {state.recordingStatus === "inactive" && (
              <Button onClick={startRecording}>Start Recording</Button>
            )}
            {state.recordingStatus === "recording" && (
              <>
                <IconButton onClick={pauseRecording}>
                  <Pause />
                </IconButton>
                <IconButton onClick={stopRecording}>
                  <Stop />
                </IconButton>
              </>
            )}
            {state.recordingStatus === "paused" && (
              <>
                <IconButton onClick={resumeRecording}>
                  <FastForward />
                </IconButton>
                <IconButton onClick={stopRecording}>
                  <Stop />
                </IconButton>
              </>
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {state.audioUrl && <audio controls src={state.audioUrl} />}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              columnGap: 2,
              mt: 2,
            }}
          >
            <Button onClick={handleClose} variant="outlined" color="error">
              Discard
            </Button>
            {state.audio && (
              <Button startIcon={<Save />} onClick={handleSubmit}>
                Save Message
              </Button>
            )}
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default AudioRecorder;
