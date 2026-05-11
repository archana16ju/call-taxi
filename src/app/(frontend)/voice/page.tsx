"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Button,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import LanguageIcon from "@mui/icons-material/Language";

export default function VoiceBookingPage() {
  const [language, setLanguage] = useState("en-US");
  const [listening, setListening] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top, #0b1220, #050814)",
        padding: 2,
      }}
    >
      {/* FIXED SIZE CONTAINER */}
      <Paper
        elevation={10}
        sx={{
          width: 420,
          height: 720,
          borderRadius: 4,
          p: 3,
          background: "linear-gradient(180deg, #0f172a, #0b1220)",
          color: "white",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#0ea5e9",
              }}
            >
              <MicIcon />
            </Box>
            <Box>
              <Typography fontWeight="bold" fontSize={18}>
                Voice Booking System
              </Typography>
              <Typography fontSize={12} color="gray">
                AI Powered Ride Assistant
              </Typography>
            </Box>
          </Stack>

          <Chip
            label="Online"
            color="success"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </Stack>

        {/* AI STATUS BOX */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#1e293b",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              🚗
            </Box>

            <Box flex={1}>
              <Typography fontWeight="bold" color="#38bdf8">
                Your AI Assistant is ready
              </Typography>
              <Typography fontSize={12} color="white">
                Speak naturally and book your ride easily.
              </Typography>
            </Box>

            <Box sx={{ color: "#22c55e" }}>▂▃▅▇▆▃▂</Box>
          </Stack>
        </Paper>

        {/* LANGUAGE */}
        <Typography mt={3} fontSize={13}  color="white">
          Language
        </Typography>

        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel sx={{  color:"white" }}>Language</InputLabel>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            sx={{ color: "white" }}
          >
            <MenuItem value="en-US">English (US)</MenuItem>
            <MenuItem value="hi-IN">Hindi</MenuItem>
            <MenuItem value="ta-IN">Tamil</MenuItem>
          </Select>
        </FormControl>

        {/* STATUS */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={13}  color="white">
              Listening Status
            </Typography>
            <Typography fontSize={13} color={listening ? "#22c55e" : "white"}>
              {listening ? "Listening..." : "Idle"}
            </Typography>
          </Stack>
        </Paper>

        {/* COMMAND */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <Typography fontSize={13}  color="white">
            Your Command
          </Typography>
          <Typography mt={1} fontSize={12} color="#94a3b8">
            Speak a command to start booking...
          </Typography>
        </Paper>

        {/* MIC BUTTON */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Box
            onClick={() => setListening(!listening)}
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #06b6d4, #6366f1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(99,102,241,0.6)",
            }}
          >
            <KeyboardVoiceIcon sx={{ fontSize: 50, color: "white" }} />
          </Box>
        </Box>

        <Typography align="center" mt={2} fontWeight="bold">
          Tap to Start Listening
        </Typography>
        <Typography align="center" fontSize={12} color="white">
          We will detect your voice
        </Typography>

        {/* AI RESPONSE */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <VolumeUpIcon />
          <Typography fontSize={12} flex={1} ml={1}>
            Play AI Response
          </Typography>
          <Button variant="contained" size="small">
            ▶
          </Button>
        </Paper>
      </Paper>
    </Box>
  );
}
