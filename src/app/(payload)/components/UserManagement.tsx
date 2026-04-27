'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
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
} from '@mui/material'
import { useAuth } from '@payloadcms/ui'
import SearchIcon from '@mui/icons-material/Search'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import dayjs from 'dayjs'

type User = {
  id: string
  email: string
  role: string
  driverProfile?: {
    id: string
    name: string
    photo?: {
        url?: string
    }
  } | string
  updatedAt: string
}

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
  const [visibleColumns, setVisibleColumns] = useState(['email', 'role', 'driverProfile', 'updatedAt', 'actions'])
  const [roleFilter, setRoleFilter] = useState('all')

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

  const getDriverName = (profile: any) => {
    if (typeof profile === 'object' && profile !== null) {
      return profile.name
    }
    return 'System Default'
  }

  const getDriverAvatar = (profile: any) => {
     if (typeof profile === 'object' && profile !== null && profile.photo?.url) {
        return profile.photo.url
     }
     return null
  }

  const toggleColumn = (col: string) => {
    setVisibleColumns(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    )
  }

  return (
    <Box sx={{ p: 4, backgroundColor: 'var(--theme-bg-page)', minHeight: '100vh', color: 'var(--theme-text)' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, color: 'var(--theme-text)' }}>
        User Management
      </Typography>

      {/* Header Actions */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <TextField
          placeholder="Search by Email"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 300,
            backgroundColor: 'var(--theme-bg-input, var(--theme-elevation-50))',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: 'var(--theme-border-color)' },
              '& input': { color: 'var(--theme-text)' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--theme-text)' }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ViewColumnIcon />}
            onClick={(e) => setColumnAnchorEl(e.currentTarget)}
            sx={{
              textTransform: 'none',
              color: 'var(--theme-text)',
              borderColor: 'var(--theme-border-color)',
              borderRadius: '8px',
              fontWeight: 600,
              '&:hover': { borderColor: 'var(--theme-elevation-500)', backgroundColor: 'var(--theme-elevation-50)' },
            }}
          >
            Columns
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{
              textTransform: 'none',
              color: 'var(--theme-text)',
              borderColor: 'var(--theme-border-color)',
              borderRadius: '8px',
              fontWeight: 600,
              '&:hover': { borderColor: 'var(--theme-elevation-500)', backgroundColor: 'var(--theme-elevation-50)' },
            }}
          >
            Filters {roleFilter !== 'all' && `(${roleFilter})`}
          </Button>
          {isSuperAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: 'none',
                backgroundColor: 'var(--theme-text)',
                color: 'var(--theme-bg-page)',
                borderRadius: '8px',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { backgroundColor: 'var(--theme-elevation-800)', boxShadow: 'none' },
              }}
              onClick={() => (window.location.href = '/admin/collections/users/create')}
            >
              Create User
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '12px',
          border: '1px solid var(--theme-border-color)',
          backgroundColor: 'var(--theme-bg-card)',
          backgroundImage: 'none',
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--theme-elevation-50)' }}>
              <TableCell padding="checkbox">
                <Checkbox size="small" sx={{ color: 'var(--theme-text)' }} />
              </TableCell>
              {visibleColumns.includes('email') && (
                <TableCell sx={{ fontWeight: 700, color: 'var(--theme-text)', fontSize: '0.875rem' }}>
                    Email
                </TableCell>
              )}
              {visibleColumns.includes('role') && (
                <TableCell sx={{ fontWeight: 700, color: 'var(--theme-text)', fontSize: '0.875rem' }}>
                    Role
                </TableCell>
              )}
              {visibleColumns.includes('driverProfile') && (
                <TableCell sx={{ fontWeight: 700, color: 'var(--theme-text)', fontSize: '0.875rem' }}>
                    Driver Profile
                </TableCell>
              )}
              {visibleColumns.includes('updatedAt') && (
                <TableCell sx={{ fontWeight: 700, color: 'var(--theme-text)', fontSize: '0.875rem' }}>
                    Updated At
                </TableCell>
              )}
              {visibleColumns.includes('actions') && (
                <TableCell align="right" sx={{ fontWeight: 700, color: 'var(--theme-text)', fontSize: '0.875rem' }}>
                    Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} align="center" sx={{ py: 8, color: 'var(--theme-text)' }}>
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} align="center" sx={{ py: 8, color: 'var(--theme-text)' }}>
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td': { borderColor: 'var(--theme-border-color)' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox size="small" sx={{ color: 'var(--theme-text)' }} />
                  </TableCell>
                  {visibleColumns.includes('email') && (
                    <TableCell>
                        <Box>
                        <Typography sx={{ fontWeight: 600, color: 'var(--theme-text)', fontSize: '0.875rem' }}>
                            {user.email}
                        </Typography>
                        <Typography sx={{ color: 'var(--theme-text)', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                            ID: {user.id}
                        </Typography>
                        </Box>
                    </TableCell>
                  )}
                  {visibleColumns.includes('role') && (
                    <TableCell>
                        <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 1.5,
                            py: 0.5,
                            border: '1px solid var(--theme-border-color)',
                            borderRadius: '6px',
                            backgroundColor: 'var(--theme-bg-input, var(--theme-elevation-50))',
                            cursor: 'pointer',
                        }}
                        >
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--theme-text)', mr: 0.5 }}>
                            {user.role === 'superadmin' ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Typography>
                        {user.role !== 'superadmin' && <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: 'var(--theme-text)' }} />}
                        </Box>
                    </TableCell>
                  )}
                  {visibleColumns.includes('driverProfile') && (
                    <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            src={getDriverAvatar(user.driverProfile)}
                            sx={{ width: 28, height: 28, backgroundColor: 'var(--theme-elevation-100)', border: '1px solid var(--theme-border-color)' }}
                        >
                            {!getDriverAvatar(user.driverProfile) && <AccountCircleIcon sx={{ fontSize: '1.25rem', color: 'var(--theme-text)' }} />}
                        </Avatar>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--theme-text)' }}>
                            {getDriverName(user.driverProfile)}
                        </Typography>
                        </Stack>
                    </TableCell>
                  )}
                  {visibleColumns.includes('updatedAt') && (
                    <TableCell>
                        <Typography sx={{ fontSize: '0.875rem', color: 'var(--theme-text)', opacity: 0.8 }}>
                        {dayjs(user.updatedAt).format('MMM D, YYYY HH:mm')}
                        </Typography>
                    </TableCell>
                  )}
                  {visibleColumns.includes('actions') && (
                    <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleActionClick(e, user.id)}>
                        <MoreVertIcon sx={{ color: 'var(--theme-text)' }} />
                        </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid var(--theme-border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--theme-bg-card)',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--theme-text)' }}>
              Per Page:
            </Typography>
            <Select
              value={perPage}
              size="small"
              onChange={(e) => setPerPage(Number(e.target.value))}
              sx={{
                height: 32,
                fontSize: '0.875rem',
                color: 'var(--theme-text)',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                fontWeight: 600,
                '& .MuiSelect-icon': { color: 'var(--theme-text)' },
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--theme-text)' }}>
              {Math.min((page - 1) * perPage + 1, totalDocs)}-{Math.min(page * perPage, totalDocs)} of {totalDocs} items
            </Typography>
          </Stack>
          <Pagination
            count={Math.ceil(totalDocs / perPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
                color: 'var(--theme-text)',
              },
              '& .Mui-selected': {
                backgroundColor: 'var(--theme-elevation-200) !important',
                color: 'var(--theme-text)',
              },
            }}
          />
        </Box>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
            window.location.href = `/admin/collections/users/${selectedUserId}`
            handleActionClose()
        }}>
            Edit User
        </MenuItem>
        <MenuItem onClick={handleActionClose} sx={{ color: 'error.main' }}>
            Delete User
        </MenuItem>
      </Menu>

      {/* Columns Menu */}
      <Menu
        anchorEl={columnAnchorEl}
        open={Boolean(columnAnchorEl)}
        onClose={() => setColumnAnchorEl(null)}
        PaperProps={{ sx: { minWidth: 180, backgroundColor: 'var(--theme-bg-card)', color: 'var(--theme-text)' } }}
      >
        <Box sx={{ p: 1 }}>
          {['email', 'role', 'driverProfile', 'updatedAt', 'actions'].map((col) => (
            <MenuItem key={col} onClick={() => toggleColumn(col)} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>
                {col === 'driverProfile' ? 'Driver Profile' : col === 'updatedAt' ? 'Updated At' : col}
              </Typography>
              <Checkbox size="small" checked={visibleColumns.includes(col)} sx={{ color: 'var(--theme-text)' }} />
            </MenuItem>
          ))}
        </Box>
      </Menu>

      {/* Filters Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{ sx: { minWidth: 180, backgroundColor: 'var(--theme-bg-card)', color: 'var(--theme-text)' } }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'var(--theme-text)', opacity: 0.6 }}>
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
    </Box>
  )
}
