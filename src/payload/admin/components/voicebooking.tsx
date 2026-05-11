'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Button,
  Stack,
} from '@mui/material'

import Link from 'next/link'

type Booking = {
  id: string
  text: string
  createdAt: string
}

export default function VoiceBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [toast, setToast] = useState({ open: false, message: '' })

  const recognitionRef = useRef<any>(null)

  // Load stored bookings
  useEffect(() => {
    const saved = localStorage.getItem('voice_bookings')
    if (saved) setBookings(JSON.parse(saved))
  }, [])

  // Save bookings
  useEffect(() => {
    localStorage.setItem('voice_bookings', JSON.stringify(bookings))
  }, [bookings])

  // AUTO voice start (no buttons)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript

      const newBooking: Booking = {
        id: Date.now().toString(),
        text: transcript,
        createdAt: new Date().toLocaleString(),
      }

      setBookings((prev) => [newBooking, ...prev])

      setToast({
        open: true,
        message: `New booking: ${transcript} at ${newBooking.createdAt}`,
      })
    }

    recognition.start()
    recognitionRef.current = recognition
  }, [])

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight={600}>
            🎤 Voice Bookings
          </Typography>

          {/* LINK TO ALERT PAGE */}
          <Link href="admin/collections/alerts">
            <Button variant="contained">Go to Alerts</Button>
          </Link>
        </Stack>

        {/* TABLE */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.text}</TableCell>
                  <TableCell>{b.createdAt}</TableCell>
                  <TableCell align="right">
                    <Button color="error" onClick={() => deleteBooking(b.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No voice bookings yet 🎤
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ALERT */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}