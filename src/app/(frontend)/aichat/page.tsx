'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Divider,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

type Message = {
  role: 'user' | 'ai'
  content: string
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hi 👋 I am your AI assistant. How can I help you today?',
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setLoading(true)

    try {
      // 🔁 Replace this with your real API (Payload / OpenAI / backend)
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      const data = await res.json()

      const aiMessage: Message = {
        role: 'ai',
        content: data.reply || 'Sorry, I could not respond.',
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Error connecting to server.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f7fb',
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          padding: 2,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        AI Chat Support
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2,
        }}
      >
        <Stack spacing={2}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justifyContent:
                  msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '70%',
                }}
              >
                {msg.role === 'ai' && (
                  <Avatar sx={{ bgcolor: '#1976d2' }}>AI</Avatar>
                )}

                <Paper
                  elevation={3}
                  sx={{
                    padding: 1.5,
                    background:
                      msg.role === 'user' ? '#1976d2' : '#ffffff',
                    color: msg.role === 'user' ? '#fff' : '#000',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">
                    {msg.content}
                  </Typography>
                </Paper>

                {msg.role === 'user' && (
                  <Avatar sx={{ bgcolor: '#4caf50' }}>U</Avatar>
                )}
              </Box>
            </Box>
          ))}
          {loading && (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Paper sx={{ p: 1.5, borderRadius: 2 }}>
        <Typography variant="body2">
          AI is typing...
        </Typography>
      </Paper>
    </Box>
  )}
        </Stack>
      </Box>

      <Divider />

      {/* Input */}
      <Box
        sx={{
          display: 'flex',
          padding: 2,
          gap: 1,
          background: '#fff',
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
        />

        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={loading}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}