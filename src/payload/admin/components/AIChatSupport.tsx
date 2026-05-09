'use client'

import React, { useState, useEffect, useRef } from 'react'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PaymentsIcon from '@mui/icons-material/Payments'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Badge,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material'

type Message = {
  role: 'user' | 'bot'
  text: string
  createdAt?: string
}

type BookingData = {
  customerName?: string
  pickup?: string
  drop?: string
  status?: string
}

const AIChatSupport = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Hello 👋 Welcome to Call Taxi AI Support. I can help you with bookings, refunds, pricing, and ride support.',
      createdAt: new Date().toISOString(),
    },
  ])

  const [unreadAlerts, setUnreadAlerts] = useState(0)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // ================= FETCH UNREAD ALERTS =================
  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts?limit=100')
      const data = await res.json()

      const unread = data?.docs?.filter((a: any) => !a.isRead).length || 0

      setUnreadAlerts(unread)
    } catch (err) {
      console.log(err)
    }
  }

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  // ================= SAVE CHAT =================
  const saveChat = async (message: Message) => {
    try {
      await fetch('/api/chat-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: message.role,
          message: message.text,
          createdAt: new Date(),
        }),
      })
    } catch (err) {
      console.log('Chat save error:', err)
    }
  }

  // ================= CREATE ALERT =================
  const createAlert = async (payload: any) => {
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: payload.title,
          message: payload.message,
          type: payload.type,
          triggeredBy: 'chatbot',
          isRead: false,
        }),
      })

      fetchAlerts()
    } catch (err) {
      console.log(err)
    }
  }

  // ================= CREATE BOOKING =================
  const createBooking = async (data: BookingData) => {
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: data.customerName || 'AI Customer',
          pickup: data.pickup || 'Unknown Pickup',
          drop: data.drop || 'Unknown Drop',
          status: data.status || 'pending',
          bookingSource: 'AI Chatbot',
        }),
      })
    } catch (err) {
      console.log('Booking error:', err)
    }
  }

  // ================= BOT REPLY =================
  const getBotReply = (text: string) => {
    const msg = text.toLowerCase()

    if (msg.includes('refund')) {
      return 'Refund request received 💳 Refunds are processed within 3–5 business days.'
    }

    if (msg.includes('book')) {
      return 'Your taxi booking request has been created 🚕 Our driver allocation system will process it soon.'
    }

    if (msg.includes('price')) {
      return 'Taxi pricing depends on distance, traffic, and ride type.'
    }

    if (msg.includes('cancel')) {
      return 'Your cancellation request has been submitted successfully.'
    }

    if (msg.includes('hello') || msg.includes('hi')) {
      return 'Hello 👋 How can I help you today?'
    }

    return 'I can help with booking, refund, cancellation, pricing, and taxi support.'
  }

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!input.trim()) return

    setLoading(true)

    const userMessage: Message = {
      role: 'user',
      text: input,
      createdAt: new Date().toISOString(),
    }

    const botMessage: Message = {
      role: 'bot',
      text: getBotReply(input),
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])

    await saveChat(userMessage)

    const msg = input.toLowerCase()

    // BOOKING
    if (msg.includes('book')) {
      await createBooking({
        customerName: 'AI Customer',
        pickup: 'Current Location',
        drop: 'Destination',
        status: 'pending',
      })

      await createAlert({
        title: 'New Booking from AI Chat',
        message: input,
        type: 'booking',
      })
    }

    // REFUND
    if (msg.includes('refund')) {
      await createAlert({
        title: 'Refund Request',
        message: input,
        type: 'payment_fail',
      })
    }

    // HELP
    if (msg.includes('help')) {
      await createAlert({
        title: 'Customer Help Request',
        message: input,
        type: 'system',
      })
    }

    setTimeout(async () => {
      setMessages((prev) => [...prev, botMessage])

      await saveChat(botMessage)

      setLoading(false)
    }, 800)

    setInput('')
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 65,
          height: 65,
          background:
            'linear-gradient(135deg,#1976d2 0%,#42a5f5 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          '&:hover': {
            background:
              'linear-gradient(135deg,#1565c0 0%,#1e88e5 100%)',
          },
          zIndex: 9999,
        }}
      >
        <Badge badgeContent={unreadAlerts} color="error">
          <ChatIcon sx={{ fontSize: 30 }} />
        </Badge>
      </IconButton>

      {/* DRAWER */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            width: 380,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#f4f7fb',
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              p: 2,
              color: 'white',
              background:
                'linear-gradient(135deg,#1976d2 0%,#42a5f5 100%)',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: 'white',
                    color: '#1976d2',
                  }}
                >
                  <SmartToyIcon />
                </Avatar>

                <Box>
                  <Typography fontWeight={700}>
                    AI Support Assistant
                  </Typography>

                  <Typography variant="caption">
                    Online • 24/7 Support
                  </Typography>
                </Box>
              </Stack>

              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon sx={{ color: 'white' }} />
              </IconButton>
            </Stack>
          </Box>

          {/* QUICK ACTIONS */}
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<DirectionsCarIcon />}
                label="Book Ride"
                color="primary"
              />

              <Chip
                icon={<PaymentsIcon />}
                label="Refund"
                color="success"
              />

              <Chip
                icon={<HelpOutlineIcon />}
                label="Help"
                color="warning"
              />
            </Stack>
          </Box>

          <Divider />

          {/* CHAT AREA */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
            }}
          >
            <Stack spacing={2}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent:
                      msg.role === 'user'
                        ? 'flex-end'
                        : 'flex-start',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-end"
                  >
                    {msg.role === 'bot' && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#1976d2',
                        }}
                      >
                        <SmartToyIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}

                    <Paper
                      elevation={2}
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        maxWidth: 250,
                        background:
                          msg.role === 'user'
                            ? '#1976d2'
                            : 'white',
                        color:
                          msg.role === 'user'
                            ? 'white'
                            : 'black',
                      }}
                    >
                      <Typography variant="body2">
                        {msg.text}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          mt: 0.5,
                          display: 'block',
                        }}
                      >
                        {new Date(
                          msg.createdAt || ''
                        ).toLocaleTimeString()}
                      </Typography>
                    </Paper>

                    {msg.role === 'user' && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#424242',
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}
                  </Stack>
                </Box>
              ))}

              {loading && (
                <Stack direction="row" spacing={1}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: '#1976d2',
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 18 }} />
                  </Avatar>

                  <Paper
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                    }}
                  >
                    <CircularProgress size={18} />
                  </Paper>
                </Stack>
              )}

              <div ref={bottomRef} />
            </Stack>
          </Box>

          {/* INPUT */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #e0e0e0',
              background: 'white',
            }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend()
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleSend}
                sx={{
                  minWidth: 55,
                  borderRadius: 3,
                }}
              >
                <SendIcon />
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default AIChatSupport