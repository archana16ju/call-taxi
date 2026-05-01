'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Switch,
  Stack,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material'

// ─── Types ────────────────────────────────────────────────────────────────────

type UserFormData = {
  email: string
  password: string
  role: string
  phoneNumber: string
  fullName: string
  username: string
  driverProfile: string
  active: boolean
}

type UserFormProps = {
  /** If provided, switches to edit mode and pre-populates the form */
  userId?: string | null
  initialData?: Partial<UserFormData>
  /** Called after a successful save so the parent can close/refresh */
  onSuccess?: () => void
}

// ─── Shared style ─────────────────────────────────────────────────────────────

const cardStyle = {
  p: 3,
  mb: 2,
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: 'none',
  backgroundColor: '#fff',
}

// ─── UserForm – reusable create / edit form ───────────────────────────────────

export function UserForm({ userId, initialData, onSuccess }: UserFormProps) {
  const isEdit = Boolean(userId)

  const [form, setForm] = useState<UserFormData>({
    email: '',
    password: '',
    role: 'driver',
    phoneNumber: '',
    fullName: '',
    username: '',
    driverProfile: '',
    active: true,
    ...initialData,
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  // When editing, fetch the latest user data from the API
  useEffect(() => {
    if (!userId) return
    setFetching(true)
    fetch(`/api/users/${userId}?depth=0`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setForm({
          email: data.email ?? '',
          password: '',            // never pre-fill password
          role: data.role ?? 'driver',
          phoneNumber: data.phoneNumber ?? '',
          fullName: data.fullName ?? '',
          username: data.username ?? '',
          driverProfile:
            typeof data.driverProfile === 'string'
              ? data.driverProfile
              : data.driverProfile?.id ?? '',
          active: data.active ?? true,
        })
      })
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [userId])

  const handleChange = (field: keyof UserFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload: Record<string, any> = {
  email: form.email,
  role: form.role,
  phoneNumber: form.phoneNumber,
  fullName: form.fullName,
  username: form.username,
  active: form.active,
}

      // Only include password if the user typed one (edit mode: leave blank to keep old)
      if (form.password) payload.password = form.password

      const res = await fetch(
        isEdit ? `/api/users/${userId}` : '/api/users',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )

      const data = await res.json()

      if (!res.ok) {
        alert(data?.errors?.[0]?.message || (isEdit ? 'Error updating user' : 'Error creating user'))
        return
      }

      alert(isEdit ? 'User updated successfully ✅' : 'User created successfully ✅')
      onSuccess?.()

      if (!onSuccess) {
        window.location.href = '/admin/collections/users'
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* IDENTITY */}
      <Paper sx={cardStyle}>
        <Typography fontWeight={700} fontSize="0.85rem" color="#64748b" textTransform="uppercase" letterSpacing="0.05em" mb={2}>
          Identity Details
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Full Name"
              fullWidth
              size="small"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Username"
              fullWidth
              size="small"
              value={form.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email"
              fullWidth
              size="small"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone Number"
              fullWidth
              size="small"
              value={form.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ACCESS */}
      <Paper sx={cardStyle}>
        <Typography fontWeight={700} fontSize="0.85rem" color="#64748b" textTransform="uppercase" letterSpacing="0.05em" mb={2}>
          Access Permissions
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <MenuItem value="superadmin">Superadmin</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="accounts">Accounts</MenuItem>
                <MenuItem value="driver">Driver</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              type="password"
              label={isEdit ? 'New Password (leave blank to keep)' : 'Password'}
              fullWidth
              size="small"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* STATUS */}
      <Paper sx={cardStyle}>
        <Typography fontWeight={700} fontSize="0.85rem" color="#64748b" textTransform="uppercase" letterSpacing="0.05em" mb={2}>
          Account Status
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Switch
            checked={form.active}
            onChange={(e) => handleChange('active', e.target.checked)}
            sx={{ '& .MuiSwitch-thumb': { backgroundColor: form.active ? '#10b981' : '#94a3b8' } }}
          />
          <Typography variant="body2" fontWeight={600} color={form.active ? '#10b981' : '#94a3b8'}>
            {form.active ? 'Active' : 'Inactive'}
          </Typography>
        </Stack>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* ACTIONS */}
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button
          variant="outlined"
          sx={{ textTransform: 'none', borderColor: '#e2e8f0', color: '#475569' }}
          onClick={() => {
            if (onSuccess) onSuccess()
            else window.location.href = '/admin/collections/users'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            textTransform: 'none',
            background: '#0f172a',
            '&:hover': { background: '#1e293b' },
            minWidth: 110,
          }}
        >
          {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : isEdit ? 'Save Changes' : 'Create User'}
        </Button>
      </Stack>
    </Box>
  )
}

// ─── Standalone page (Payload custom view) ────────────────────────────────────

export default function UserCreate() {
  return (
    <Box sx={{ p: 4, background: '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight={700} mb={3} color="#1e293b">
        Create New User
      </Typography>
      <UserForm />
    </Box>
  )
}