'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  Checkbox,
  Pagination,
  InputAdornment,
  Avatar,
  Menu,
  Grid,
  LinearProgress,
  Drawer,
  Divider,
} from '@mui/material'
import { UserForm } from './UserCreate'
import { useAuth } from '@payloadcms/ui'
import SearchIcon from '@mui/icons-material/Search'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import GroupIcon from '@mui/icons-material/Group'
import PeopleIcon from '@mui/icons-material/People'
import InfoIcon from '@mui/icons-material/Info'
import EditIcon from '@mui/icons-material/Edit'
import AssessmentIcon from '@mui/icons-material/Assessment'
import dayjs from 'dayjs'

type User = {
  id: string
  email: string
  role: string
  username?: string
  phoneNumber?: string
  fullName?: string   
  active?: boolean
  driverProfile?:
    | {
        id: string
        name: string
        photo?: {
          url?: string
        }
      }
    | string
  updatedAt: string
}

const StatCard = ({ title, value, subValue, icon, progress, roleFilter, setRoleFilter }: any) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      height: '100%',
      backgroundColor: '#fff',
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#64748b',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ color: '#0369a1' }}>{icon}</Box>
    </Stack>

    {progress !== undefined ? (
  <Box sx={{ mt: 1 }}>
    <Box
      sx={{
        display: 'flex',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#e2e8f0',
      }}
    >
      <Box sx={{ width: `${progress.superadmin || 0}%`, backgroundColor: '#7c3aed' }} />
      <Box sx={{ width: `${progress.admin || 0}%`, backgroundColor: '#eab308' }} />
      <Box sx={{ width: `${progress.accounts || 0}%`, backgroundColor: '#0ea5e9' }} />
      <Box sx={{ width: `${progress.driver || 0}%`, backgroundColor: '#22c55e' }} />
    </Box>

   <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
  
  <Typography
    onClick={() => setRoleFilter('superadmin')}
    sx={{
      color: '#7c3aed',
      fontSize: '0.7rem',
      fontWeight: 600,
      cursor: 'pointer',
      opacity: roleFilter === 'superadmin' ? 1 : 0.6,
    }}
  >
    Super Admin
  </Typography>

  <Typography
    onClick={() => setRoleFilter('admin')}
    sx={{
      color: '#eab308',
      fontSize: '0.7rem',
      fontWeight: 600,
      cursor: 'pointer',
      opacity: roleFilter === 'admin' ? 1 : 0.6,
    }}
  >
    Admin
  </Typography>

  <Typography
    onClick={() => setRoleFilter('accounts')}
    sx={{
      color: '#0ea5e9',
      fontSize: '0.7rem',
      fontWeight: 600,
      cursor: 'pointer',
      opacity: roleFilter === 'accounts' ? 1 : 0.6,
    }}
  >
    Accounts
  </Typography>

  <Typography
    onClick={() => setRoleFilter('driver')}
    sx={{
      color: '#22c55e',
      fontSize: '0.7rem',
      fontWeight: 600,
      cursor: 'pointer',
      opacity: roleFilter === 'driver' ? 1 : 0.6,
    }}
  >
    Driver
  </Typography>
 <Typography
  onClick={() => setRoleFilter('all')}
  sx={{
    color: '#64748b',
    fontSize: '0.7rem',
    fontWeight: 600,
    cursor: 'pointer',
    opacity: roleFilter === 'all' ? 1 : 0.6,
  }}
>
  All
</Typography>
</Stack>
  </Box>
) : (
  <Stack direction="row" alignItems="baseline" spacing={1}>
    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
      {value}
    </Typography>
    {subValue && (
      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
        {subValue}
      </Typography>
    )}
  </Stack>
)}
  </Paper>
)

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { user: currentUser } = useAuth()
  const isSuperAdmin = currentUser?.role === 'superadmin'

  // Columns & Filters State
  const [columnAnchorEl, setColumnAnchorEl] = useState<null | HTMLElement>(null)
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [visibleColumns, setVisibleColumns] = useState([
    'id',
    'name',
    'email',
    'username',
    'phoneNumber',
    'role',
    'status',
    'actions',
  ])
  const [roleFilter, setRoleFilter] = useState('all')

  const [openDrawer, setOpenDrawer] = useState(false)
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null)

  const openCreate = () => {
    setDrawerUserId(null)
    setOpenDrawer(true)
  }
  const openEdit = (id: string) => {
    setDrawerUserId(id)
    setOpenDrawer(true)
  }
  const closeDrawer = async () => {
  setOpenDrawer(false)
  setDrawerUserId(null)
  await fetchUsers()
}

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        limit: perPage.toString(),
        page: page.toString(),
        depth: '1',
      })
      if (search) {
        query.append('where[email][contains]', search)
      }
      if (roleFilter !== 'all') {
        query.append('where[role][equals]', roleFilter)
      }
      const res = await fetch(`/api/users?${query.toString()}`, {
        credentials: 'include',
      })
      const data = await res.json()
      setUsers(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, search, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedUserId(userId)
  }

  const handleActionClose = () => {
    setAnchorEl(null)
    setSelectedUserId(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return { bg: '#7c3aed', text: '#7c3aed' }
      case 'admin':
        return { bg: '#fef9c3', text: '#854d0e' }
      case 'accounts':
        return { bg: '#e0f2fe', text: '#075985' }
      case 'driver':
        return { bg: '#dcfce7', text: '#166534' }
      default:
        return { bg: '#f1f5f9', text: '#475569' }
    }
  }

  const activeDrivers = useMemo(() => {
  return users.filter(
    (u) => u.role === 'driver' && u.active !== false
  ).length
}, [users])

const roleStats = useMemo(() => {
  const total = users.length || 1

  const counts = {
    superadmin: users.filter(u => u.role === 'superadmin').length,
    admin: users.filter(u => u.role === 'admin').length,
    accounts: users.filter(u => u.role === 'accounts').length,
    driver: users.filter(u => u.role === 'driver').length,
  }

  return {
    superadmin: (counts.superadmin / total) * 100,
    admin: (counts.admin / total) * 100,
    accounts: (counts.accounts / total) * 100,
    driver: (counts.driver / total) * 100,
  }
}, [users])

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' , fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',}}>

      {/* Top Header */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
        <IconButton size="small">
          <MoreVertIcon sx={{ transform: 'rotate(90deg)' }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b',fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}>
          User Management
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
  variant="contained"
  startIcon={<PersonAddIcon />}
  onClick={openCreate}
  sx={{
    textTransform: 'none',
    backgroundColor: '#0ea5e9',
    color: '#fff',
    borderRadius: '8px',
    px: 2,
    py: 1,
    fontWeight: 600,
    fontSize: '0.8rem',
    minWidth: 'auto',
    boxShadow: 'none',

    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',

    '&:hover': {
      backgroundColor: '#0284c7',
    },
  }}
>
  Create New User
</Button>
      </Stack>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Active Drivers"
            value={activeDrivers.toString()}
            icon={<LocalShippingIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
  title="Role Distribution"
  progress={roleStats}
  icon={<AssessmentIcon />}
  roleFilter={roleFilter}
  setRoleFilter={setRoleFilter}
/>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Total Entry" value={totalDocs.toString()} icon={<GroupIcon />} />
        </Grid>
      </Grid>

      {/* Actions Toolbar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#475569',
              backgroundColor: '#fff',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#f1f5f9' },
            }}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<ViewColumnIcon />}
            sx={{
              textTransform: 'none',
              borderColor: '#e2e8f0',
              color: '#475569',
              backgroundColor: '#fff',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#f1f5f9' },
            }}
            onClick={(e) => setColumnAnchorEl(e.currentTarget)}
          >
            Columns
          </Button>
        </Stack>
      </Stack>

      {/* Table Section */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: '8px', boxShadow: 'none', border: '1px solid #e2e8f0' }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Username
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Phone Number
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Role
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Status
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => {
                const roleStyle = getRoleColor(user.role)
                return (
                  <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                      {(page - 1) * perPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {user.fullName || user.username || user.email.split('@')[0]}
                    </TableCell>

                    <TableCell sx={{ color: '#64748b' }}>{user.email}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {user.username || user.email.split('@')[0]}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {user.phoneNumber || '+91 98765 43210'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'superadmin' ? 'SUPER ADMIN' : user.role.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: roleStyle.bg,
                          color: roleStyle.text,
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
  sx={{
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: user.active ? '#10b981' : '#ef4444',
  }}
/>
<Typography
  variant="caption"
  sx={{
    fontWeight: 700,
    color: user.active ? '#166534' : '#991b1b',
    backgroundColor: user.active ? '#dcfce7' : '#fee2e2',
    px: 1,
    py: 0.25,
    borderRadius: '12px',
  }}
>
  {user.active ? 'ACTIVE' : 'INACTIVE'}
</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEdit(user.id)}>
                        <EditIcon sx={{ fontSize: '1.25rem', color: '#64748b' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Footer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}
        >
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Showing {Math.min((page - 1) * perPage + 1, totalDocs)}-
            {Math.min(page * perPage, totalDocs)} of {totalDocs} entries
          </Typography>
          <Pagination
            count={Math.ceil(totalDocs / perPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            size="small"
            sx={{
              '& .MuiPaginationItem-root': { fontWeight: 700 },
              '& .Mui-selected': { backgroundColor: '#1e293b !important', color: '#fff' },
            }}
          />
        </Stack>
      </TableContainer>

      {/* Filters Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{ sx: { minWidth: 180 } }}
      >
        <Box sx={{ p: 1 }}>
          <Typography
            variant="caption"
            sx={{ px: 2, py: 1, display: 'block', color: '#64748b', fontWeight: 700 }}
          >
            Filter by Role
          </Typography>
          {['all', 'superadmin', 'admin', 'accounts', 'driver'].map((role) => (
            <MenuItem
              key={role}
              onClick={() => {
                setRoleFilter(role)
                setFilterAnchorEl(null)
              }}
              selected={roleFilter === role}
            >
              <Typography sx={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>
                {role}
              </Typography>
            </MenuItem>
          ))}
        </Box>
      </Menu>

      {/* Columns Menu */}
      <Menu
        anchorEl={columnAnchorEl}
        open={Boolean(columnAnchorEl)}
        onClose={() => setColumnAnchorEl(null)}
        PaperProps={{ sx: { minWidth: 180 } }}
      >
        <Box sx={{ p: 1 }}>
          <Typography
            variant="caption"
            sx={{ px: 2, py: 1, display: 'block', color: '#64748b', fontWeight: 700 }}
          >
            Toggle Columns
          </Typography>
          {['id', 'name', 'email', 'username', 'phoneNumber', 'role', 'status', 'actions'].map(
            (col) => (
              <MenuItem
                key={col}
                onClick={() => {
                  setVisibleColumns((prev) =>
                    prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
                  )
                }}
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography sx={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>
                  {col}
                </Typography>
                <Checkbox size="small" checked={visibleColumns.includes(col)} />
              </MenuItem>
            ),
          )}
        </Box>
      </Menu>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={closeDrawer}
        PaperProps={{ sx: { width: 400, p: 2 } }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {drawerUserId ? 'Edit User' : 'Create User'}
        </Typography>

        <UserForm userId={drawerUserId} onSuccess={closeDrawer} />
      </Drawer>
    </Box>
  )
}
