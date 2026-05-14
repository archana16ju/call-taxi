'use client'

import React, { useEffect, useState } from 'react'

import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Switch,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SecurityIcon from '@mui/icons-material/Security'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

type RoleType = {
  id: string
  name: string
  permissions: string[]
  users: number
  active: boolean
}

const ALL_PERMISSIONS = [
  '/admin',
  '/admin/collections/users',
  '/admin/collections/drivers',
  '/admin/collections/customers',
  '/admin/collections/slider-images',
  '/admin/collections/media',
  '/admin/collections/vehicles',
  '/admin/collections/bookings',
  '/admin/driver-allocation',
  '/admin/voice-dispatch',
  '/admin/collections/ride-preferences',
  '/live-tracking',
  '/admin/collections/driver-offline-logs',
  '/admin/globals/general-settings',
  '/admin/collections/ai-chat-conversations',
  '/admin/globals/cancellation-control',
  '/admin/collections/trip-otps',
  '/admin/collections/trip-sharing',
  '/admin/collections/revenue-settlements',
  '/admin/collections/invoices',
  '/admin/globals/payment-settings',
  '/admin/collections/payment-methods',
  '/admin/collections/tariffs',
  '/admin/collections/coupons',
  '/admin/collections/alerts',
  '/admin/collections/contacts',
  '/admin/globals/customer-report',
  '/admin/globals/booking-report',
  '/admin/globals/vehicle-report',
  '/admin/collections/reviews',
  '/admin/collections/roles',
]

export default function RolesPage() {

  const [search, setSearch] = useState('')
  const [roles, setRoles] = useState<RoleType[]>([])
  const [loading, setLoading] = useState(true)

  const [openEdit, setOpenEdit] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null)

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [roleActive, setRoleActive] = useState(true)

  useEffect(() => {
    fetchRoles()
  }, [])

  // ✅ FIXED: REAL backend-driven roles
  const fetchRoles = async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/roles')
      const data = await res.json()

      const rolesFromAPI = data.docs || []

      const roleData: RoleType[] = rolesFromAPI.map((role: any, index: number) => ({
        id: role.id || String(index + 1),
        name: role.name,
        active: role.active ?? false,

        permissions: role.permissions?.includes('*')
          ? ['Full System Access']
          : (role.permissions || []).map((p: any) => p.path),

        users: role.usersCount || 0,
      }))

      setRoles(roleData)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return '#fbbf24'
      case 'admin': return '#3b82f6'
      case 'accounts': return '#22c55e'
      default: return '#a855f7'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return <SecurityIcon />
      case 'admin': return <AdminPanelSettingsIcon />
      case 'accounts': return <AccountBalanceWalletIcon />
      default: return <SecurityIcon />
    }
  }

  const handleEdit = (role: RoleType) => {
    setSelectedRole(role)
    setSelectedPermissions(role.permissions)
    setRoleActive(role.active)
    setOpenEdit(true)
  }

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    )
  }

  const handleSaveRole = async () => {
    if (!selectedRole) return

    await fetch(`/api/roles/${selectedRole.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        active: roleActive,
        permissions: selectedPermissions.map((p) => ({ path: p })),
      }),
    })

    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id
          ? { ...r, active: roleActive, permissions: selectedPermissions }
          : r
      )
    )

    setOpenEdit(false)
  }

  // ✅ FIXED DELETE (was broken in your code)
  const handleDelete = async (roleName: string) => {
    if (roleName === 'superadmin') return

    await fetch(`/api/roles/${roleName}`, {
      method: 'DELETE',
    })

    fetchRoles()
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#081120', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#fbbf24' }} />
      </Box>
    )
  }

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #0f2747 0%, #081120 50%, #050b16 100%)', p: 4 }}>

      {/* UI untouched below */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900, mb: 1 }}>
            Roles Management
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '1rem' }}>
            Manage system roles and permissions
          </Typography>
        </Box>
      </Stack>

      <Paper sx={{ background: 'rgba(10,20,40,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '28px', p: 3 }}>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <TextField
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />

          <IconButton onClick={fetchRoles}>
            <RefreshIcon />
          </IconButton>
        </Stack>

        <Stack spacing={2}>
          {filteredRoles.map((role) => (
            <Paper key={role.id} sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between">

                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: getRoleColor(role.name) }}>
                    {getRoleIcon(role.name)}
                  </Avatar>

                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 800 }}>
                      {role.name}
                    </Typography>

                    <Chip
                      label={role.active ? 'Active' : 'Inactive'}
                      size="small"
                    />
                  </Box>
                </Stack>

                <Box>
                  <Typography sx={{ color: '#fff' }}>
                    {role.permissions.includes('Full System Access')
                      ? 'ALL'
                      : role.permissions.length}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => handleEdit(role)}>
                    <EditIcon />
                  </IconButton>

                  {role.name !== 'superadmin' && (
                    <IconButton onClick={() => handleDelete(role.name)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

              </Stack>
            </Paper>
          ))}
        </Stack>

      </Paper>

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>

        <DialogTitle>Edit Role</DialogTitle>

        <DialogContent>

          <FormControlLabel
            control={
              <Switch
                checked={roleActive}
                onChange={(e) => setRoleActive(e.target.checked)}
              />
            }
            label={roleActive ? 'Active' : 'Inactive'}
          />

          <Stack>
            {ALL_PERMISSIONS.map((p) => (
              <FormControlLabel
                key={p}
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(p)}
                    onChange={() => handlePermissionToggle(p)}
                  />
                }
                label={p}
              />
            ))}
          </Stack>

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained">Save</Button>
        </DialogActions>

      </Dialog>

    </Box>
  )
}