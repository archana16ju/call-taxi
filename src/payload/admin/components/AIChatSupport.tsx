'use client'

import React, { useState, useEffect } from 'react'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Badge
} from '@mui/material'


type Message = {
  role: 'user' | 'bot'
  text: string
}

const AIChatSupport = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi 👋 I am your AI Support Assistant. I can help with booking, refunds, and FAQs.' }
  ])

  const handleSend = async () => {
  if (!input.trim()) return

  const userMsg: Message = { role: 'user', text: input }
  const botReply = getBotReply(input)

  setMessages((prev) => [
    ...prev,
    userMsg,
    { role: 'bot', text: botReply },
  ])

  const msg = input.toLowerCase()

  // 🚨 BOOKING ALERT
  if (msg.includes('book')) {
    await createAlert({
      title: 'AI Chat Booking',
      message: input,
      type: 'booking',
      triggeredBy: 'chatbot',
    })
  }

  // 🚨 REFUND ALERT
  if (msg.includes('refund')) {
    await createAlert({
      title: 'AI Chat Refund Request',
      message: input,
      type: 'payment_fail',
      triggeredBy: 'chatbot',
    })
  }

  setInput('')
}

  const getBotReply = (text: string) => {
    const msg = text.toLowerCase()

    if (msg.includes('refund')) return 'Refunds are processed within 3–5 business days.'
    if (msg.includes('book')) return 'Booking request received! Our system is processing it 🚗'
    if (msg.includes('price')) return 'Pricing depends on distance and ride type.'
    if (msg.includes('hello')) return 'Hello! How can I help you today?'
    
    return 'I can help with booking, refunds, and FAQs. Please ask your question.'
  }

  const [unreadAlerts, setUnreadAlerts] = useState(0)

useEffect(() => {
  const fetchAlerts = async () => {
    const res = await fetch('/api/alerts?limit=50')
    const data = await res.json()
    const unread = data.docs.filter((a: any) => !a.isRead).length
    setUnreadAlerts(unread)
  }

  fetchAlerts()
}, [])

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
        triggeredBy: payload.triggeredBy || 'chatbot',
        isRead: false,
      }),
    })
  } catch (err) {
    console.log('Alert error:', err)
  }
}

  return (
    <>
      {/* Floating Chat Button */}
      <IconButton
  onClick={() => setOpen(true)}
  sx={{
    position: 'fixed',
    bottom: 20,
    right: 20,
    backgroundColor: '#1976d2',
    color: 'white'
  }}
>
  <Badge badgeContent={unreadAlerts} color="error">
    <ChatIcon />
  </Badge>
</IconButton>
      

      {/* Chat Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 350, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Header */}
          <Box sx={{ p: 2, background: '#1976d2', color: 'white' }}>
            <Typography variant="h6">AI Support Chat</Typography>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            <Stack spacing={1}>
              {messages.map((msg, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 1,
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                    maxWidth: '80%'
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
            />
            <Button variant="contained" onClick={handleSend}>
              <SendIcon />
            </Button>
          </Box>

        </Box>
      </Drawer>
    </>
  )
}

export default AIChatSupport