'use client'

import React, { useEffect, useState } from 'react'

import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  TextField,
  MenuItem,
  Avatar,
  IconButton,
  Pagination,
  Divider,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'

type Chat = {
  id: string
  role: 'user' | 'ai'
  message: string
  createdAt: string
}

const AIChatSupportPage = () => {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const [messages, setMessages] = useState<Chat[]>([])

  // ================= FETCH CHATS =================
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chat-support?limit=100')

        const data = await res.json()

        const formatted = data.docs.map((item: any) => ({
          id: item.id,
          role: item.role === 'bot' ? 'ai' : 'user',
          message: item.message,
          createdAt: item.createdAt,
        }))

        setMessages(formatted)
      } catch (err) {
        console.log(err)
      }
    }

    fetchChats()
  }, [])

  // ================= FILTER =================
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.message
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesRole =
      roleFilter === 'all' || msg.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <Box
      sx={{
        p: 3,
        background: '#f5f7fb',
        minHeight: '100vh',
      }}
    >
      {/* TOP */}
      <Box mb={3}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="#111827"
        >
          AI Chat Support
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          mt={1}
        >
          All chats from website users with AI Support
        </Typography>
      </Box>

      {/* FILTERS */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 4,
          mb: 3,
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
        }}
      >
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={2}
        >
          <TextField
            fullWidth
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1 }} />
              ),
            }}
          />

          <TextField
            select
            sx={{ minWidth: 180 }}
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
          >
            <MenuItem value="all">All Roles</MenuItem>

            <MenuItem value="user">User</MenuItem>

            <MenuItem value="ai">AI</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography fontWeight={700}>
              Chat Messages
            </Typography>

            <Chip
              label={`${filteredMessages.length} Chats`}
              color="primary"
            />
          </Stack>
        </Box>

        {/* TABLE HEADER */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 120px 3fr 200px 60px',
            gap: 2,
            px: 3,
            py: 2,
            background: '#f9fafb',
            fontWeight: 700,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Typography fontWeight={700}>ID</Typography>

          <Typography fontWeight={700}>Role</Typography>

          <Typography fontWeight={700}>
            Message
          </Typography>

          <Typography fontWeight={700}>
            Created At
          </Typography>

          <Typography fontWeight={700}>
            Action
          </Typography>
        </Box>

        {/* ROWS */}
        {filteredMessages.map((msg) => (
          <Box key={msg.id}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 120px 3fr 200px 60px',
                gap: 2,
                px: 3,
                py: 2,
                alignItems: 'center',
                transition: '0.2s',
                '&:hover': {
                  background: '#f9fafb',
                },
              }}
            >
              {/* ID */}
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                {msg.id.slice(0, 16)}
              </Typography>

              {/* ROLE */}
              <Box>
                {msg.role === 'ai' ? (
                  <Chip
                    icon={
                      <SmartToyRoundedIcon />
                    }
                    label="AI"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={
                      <PersonRoundedIcon />
                    }
                    label="User"
                    color="primary"
                    size="small"
                  />
                )}
              </Box>

              {/* MESSAGE */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    bgcolor:
                      msg.role === 'ai'
                        ? '#16a34a'
                        : '#1976d2',
                  }}
                >
                  {msg.role === 'ai' ? (
                    <SmartToyRoundedIcon />
                  ) : (
                    <PersonRoundedIcon />
                  )}
                </Avatar>

                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.7,
                  }}
                >
                  {msg.message}
                </Typography>
              </Stack>

              {/* DATE */}
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {new Date(
                  msg.createdAt
                ).toLocaleString()}
              </Typography>

              {/* ACTION */}
              <IconButton>
                <MoreHorizRoundedIcon />
              </IconButton>
            </Box>

            <Divider />
          </Box>
        ))}

        {/* PAGINATION */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Pagination
            count={10}
            color="primary"
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default AIChatSupportPage