'use client'

import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export const Logo: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          backgroundColor: '#fbbf24',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        <LocalTaxiIcon sx={{ color: '#000000', fontSize: '1.25rem' }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--theme-text)',
          fontSize: '1.1rem',
        }}
      >
        Kani Taxi
      </Typography>
    </Box>
  )
}

export default function Login() {
  const { refreshCookieAsync } = useAuth()
  const router = useRouter()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || 'Invalid username or password')
      }

      await refreshCookieAsync()
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        backgroundImage: 'radial-gradient(circle at 20% 30%, #1e293b 0%, #0f172a 100%)',
        p: 3,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: '24px',
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box sx={{ p: 4, pt: 6, pb: 6 }}>
          <Stack spacing={4} alignItems="center">
            {/* Logo */}
            <Box
              sx={{
                width: 64,
                height: 64,
                backgroundColor: '#fbbf24',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.3)',
                mb: 1,
              }}
            >
              <LocalTaxiIcon sx={{ color: '#000000', fontSize: '2.5rem' }} />
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Please enter your credentials to access the portal
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error" sx={{ borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      color: '#fff',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: '#fbbf24' },
                      '&.Mui-focused fieldset': { borderColor: '#fbbf24' },
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#fbbf24' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#64748b' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      color: '#fff',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: '#fbbf24' },
                      '&.Mui-focused fieldset': { borderColor: '#fbbf24' },
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#fbbf24' },
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    backgroundColor: '#fbbf24',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 6px -1px rgba(251, 191, 36, 0.3)',
                    '&:hover': {
                      backgroundColor: '#f59e0b',
                      boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.4)',
                    },
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="caption" sx={{ color: '#64748b', mt: 4 }}>
              © 2026 Kani Taxi Services • Secure Administrator Portal
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}