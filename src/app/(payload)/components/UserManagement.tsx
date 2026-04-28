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
  driverProfile?: {
    id: string
    name: string
    photo?: {
        url?: string
    }
  } | string
  updatedAt: string
}

const StatCard = ({ title, value, subValue, icon, progress }: any) => (
  <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', height: '100%', backgroundColor: '#fff' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {title}
      </Typography>
      <Box sx={{ color: '#0369a1' }}>
        {icon}
      </Box>
    </Stack>
    
    {progress !== undefined ? (
      <Box sx={{ mt: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4, 
            backgroundColor: '#e2e8f0',
            '& .MuiLinearProgress-bar': { backgroundColor: '#0ea5e9' }
          }} 
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
          {['Super Admin', 'Admin', 'Driver', 'Accounts'].map((label) => (
            <Typography key={label} variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', fontWeight: 500 }}>
              {label}
            </Typography>
          ))}
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
  const [visibleColumns, setVisibleColumns] = useState(['id', 'name', 'email', 'username', 'phoneNumber', 'role', 'status', 'actions'])
  const [roleFilter, setRoleFilter] = useState('all')

  const [openDrawer, setOpenDrawer] = useState(false)
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null)

  const openCreate = () => { setDrawerUserId(null); setOpenDrawer(true) }
  const openEdit = (id: string) => { setDrawerUserId(id); setOpenDrawer(true) }
  const closeDrawer = () => { setOpenDrawer(false); setDrawerUserId(null); fetchUsers() }

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
      case 'superadmin': return { bg: '#fef3c7', text: '#92400e' }
      case 'admin': return { bg: '#fef9c3', text: '#854d0e' }
      case 'accounts': return { bg: '#e0f2fe', text: '#075985' }
      case 'driver': return { bg: '#dcfce7', text: '#166534' }
      default: return { bg: '#f1f5f9', text: '#475569' }
    }
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      {/* Top Header */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
        <IconButton size="small">
          <MoreVertIcon sx={{ transform: 'rotate(90deg)' }} />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
          User Management
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Avatar sx={{ width: 32, height: 32, backgroundColor: '#e2e8f0' }}>
            <GroupIcon sx={{ color: '#64748b' }} />
        </Avatar>
      </Stack>
<Box sx={{ p: 2, mt: 2, display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => (window.location.href = '/admin/collections/users/create')}>
  <PeopleIcon sx={{ color: '#64748b', mr: 1 }} />
  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>Create New User</Typography>
</Box>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard 
            title="Active Drivers" 
            value="284" 
            subValue="+12%" 
            icon={<LocalShippingIcon />} 
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard 
            title="Role Distribution" 
            progress={75} 
            icon={<AssessmentIcon />} 
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard 
            title="Total Entry" 
            value={totalDocs.toString()} 
            icon={<GroupIcon />} 
          />
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
              '&:hover': { backgroundColor: '#f1f5f9' }
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
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}
            onClick={(e) => setColumnAnchorEl(e.currentTarget)}
          >
            Columns
          </Button>
        </Stack>

        {isSuperAdmin && (
          <Button
            variant="contained"
            startIcon={<PeopleIcon />}
            sx={{
              textTransform: 'none',
              backgroundColor: '#1e293b',
              color: '#fff',
              borderRadius: '6px',
              px: 3,
              fontWeight: 700,
              '&:hover': { backgroundColor: '#0f172a' }
            }}
            onClick={openCreate}
          >
            Create New User
          </Button>
        )}
      </Stack>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</TableCell>
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
                        <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>{(page - 1) * perPage + index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {typeof user.driverProfile === 'object' ? user.driverProfile.name : user.email.split('@')[0]}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>{user.email}</TableCell>
                        <TableCell sx={{ color: '#64748b' }}>{user.username || user.email.split('@')[0]}</TableCell>
                        <TableCell sx={{ color: '#64748b' }}>{user.phoneNumber || '+91 98765 43210'}</TableCell>
                        <TableCell>
                            <Chip 
                            label={user.role === 'superadmin' ? 'SUPER ADMIN' : user.role.toUpperCase()} 
                            size="small" 
                            sx={{ 
                                backgroundColor: roleStyle.bg, 
                                color: roleStyle.text, 
                                fontWeight: 700, 
                                fontSize: '0.65rem',
                                borderRadius: '6px'
                            }} 
                            />
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#166534', backgroundColor: '#dcfce7', px: 1, py: 0.25, borderRadius: '12px' }}>
                                ACTIVE
                            </Typography>
                            </Stack>
                        </TableCell>
                        <TableCell align="right">
                            <IconButton size="small" onClick={() => (window.location.href = `/admin/collections/users/${user.id}`)}>
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Showing {Math.min((page - 1) * perPage + 1, totalDocs)}-{Math.min(page * perPage, totalDocs)} of {totalDocs} entries
          </Typography>
          <Pagination 
            count={Math.ceil(totalDocs / perPage)} 
            page={page} 
            onChange={(_, v) => setPage(v)}
            shape="rounded"
            size="small"
            sx={{
              '& .MuiPaginationItem-root': { fontWeight: 700 },
              '& .Mui-selected': { backgroundColor: '#1e293b !important', color: '#fff' }
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
          <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: '#64748b', fontWeight: 700 }}>
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
           <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: '#64748b', fontWeight: 700 }}>
            Toggle Columns
          </Typography>
          {['id', 'name', 'email', 'username', 'phoneNumber', 'role', 'status', 'actions'].map((col) => (
            <MenuItem key={col} onClick={() => {
                setVisibleColumns(prev => 
                    prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
                )
            }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ textTransform: 'capitalize', fontSize: '0.875rem' }}>
                {col}
              </Typography>
              <Checkbox size="small" checked={visibleColumns.includes(col)} />
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  )
}
