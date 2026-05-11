'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import {
  Box,
  Typography,
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
  Menu,
  Grid,
  Drawer,
  TextField,
  InputAdornment,
  
} from '@mui/material'

import { UserForm } from './UserCreate'
import { useAuth } from '@payloadcms/ui'

import SearchIcon from '@mui/icons-material/Search'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import GroupIcon from '@mui/icons-material/Group'
import EditIcon from '@mui/icons-material/Edit'
import AssessmentIcon from '@mui/icons-material/Assessment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

type User = {
  id: string
  email: string
  role: string
  username?: string
  phoneNumber?: string
  fullName?: string
  active?: boolean
  updatedAt: string
}

const StatCard = ({
  title,
  value,
  subValue,
  icon,
  progress,
  roleFilter,
  setRoleFilter,
}: any) => {
  const [openRoles, setOpenRoles] = useState(false)

  const roleItems = [
    {
      key: 'superadmin',
      label: 'Super Admin',
      color: '#a855f7',
      percent: progress?.superadmin || 0,
    },
    {
      key: 'admin',
      label: 'Admin',
      color: '#facc15',
      percent: progress?.admin || 0,
    },
    {
      key: 'accounts',
      label: 'Accounts',
      color: '#38bdf8',
      percent: progress?.accounts || 0,
    },
    {
      key: 'driver',
      label: 'Drivers',
      color: '#22c55e',
      percent: progress?.driver || 0,
    },
  ]

  // NORMAL NUMBER CARDS
  if (!progress) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          background: '#fff',
          boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
          minHeight: 220,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: '2.2rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background:
                'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </Paper>
    )
  }

  // ROLE DISTRIBUTION DROPDOWN CARD
  return (
    <Paper
      sx={{
        position: 'relative',
        overflow: 'visible',
        p: 3,
        borderRadius: '18px',
        border: '1px solid #e2e8f0',
        background: '#fff',
        boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
        minHeight: 220,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            sx={{
              color: '#64748b',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#0f172a',
              mt: 0.5,
            }}
          >
            Role Filters
          </Typography>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background:
              'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0284c7',
          }}
        >
          {icon}
        </Box>
      </Stack>

      {/* Dropdown Trigger */}
      <Box
        onClick={() => setOpenRoles(!openRoles)}
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          px: 2,
          py: 1.5,
          cursor: 'pointer',
          transition: '0.2s ease',
          backgroundColor: '#f8fafc',

          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              fontSize: '0.92rem',
            }}
          >
            {roleFilter === 'all'
              ? 'All Roles'
              : roleItems.find(r => r.key === roleFilter)?.label}
          </Typography>

          <KeyboardArrowDownIcon
            sx={{
              transition: '0.25s ease',
              transform: openRoles
                ? 'rotate(180deg)'
                : 'rotate(0deg)',
            }}
          />
        </Stack>
      </Box>

      {/* Dropdown Content */}
      {/* Dropdown Content */}
{openRoles && (
  <Box
    sx={{
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      mt: 1.2,
      zIndex: 50,
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      p: 1.2,
      boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
    }}
  >
    <Stack spacing={1.2}>
          <Box
            onClick={() => {
              setRoleFilter('all')
              setOpenRoles(false)
            }}
            sx={{
              p: 1.5,
              borderRadius: '12px',
              cursor: 'pointer',
              backgroundColor:
                roleFilter === 'all'
                  ? '#e0f2fe'
                  : '#f8fafc',

              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>
              All Users
            </Typography>
          </Box>

          {roleItems.map((item) => (
            <Box
              key={item.key}
              onClick={() => {
                setRoleFilter(item.key)
                setOpenRoles(false)
              }}
              sx={{
                p: 1.5,
                borderRadius: '12px',
                cursor: 'pointer',
                border:
                  roleFilter === item.key
                    ? `1px solid ${item.color}`
                    : '1px solid transparent',

                backgroundColor:
                  roleFilter === item.key
                    ? `${item.color}15`
                    : '#f8fafc',

                '&:hover': {
                  backgroundColor: `${item.color}15`,
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                    }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontWeight: 800,
                    color: item.color,
                  }}
                >
                  {item.percent.toFixed(0)}%
                </Typography>
              </Stack>
            </Box>
          ))}
             </Stack>
      </Box>
    )}
    </Paper>
  )
}
export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)

  const [columnAnchorEl, setColumnAnchorEl] = useState<null | HTMLElement>(null)

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return {
          bg: '#ede9fe',
          text: '#6d28d9',
        }

      case 'admin':
        return {
          bg: '#fef9c3',
          text: '#854d0e',
        }

      case 'accounts':
        return {
          bg: '#e0f2fe',
          text: '#075985',
        }

      case 'driver':
        return {
          bg: '#dcfce7',
          text: '#166534',
        }

      default:
        return {
          bg: '#f1f5f9',
          text: '#475569',
        }
    }
  }

  const activeDrivers = useMemo(() => {
    return users.filter((u) => u.role === 'driver' && u.active !== false).length
  }, [users])

  const roleStats = useMemo(() => {
    const total = users.length || 1

    const counts = {
      superadmin: users.filter((u) => u.role === 'superadmin').length,
      admin: users.filter((u) => u.role === 'admin').length,
      accounts: users.filter((u) => u.role === 'accounts').length,
      driver: users.filter((u) => u.role === 'driver').length,
    }

    return {
      superadmin: (counts.superadmin / total) * 100,
      admin: (counts.admin / total) * 100,
      accounts: (counts.accounts / total) * 100,
      driver: (counts.driver / total) * 100,
    }
  }, [users])

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        color: '#1e293b',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      {/* HEADER */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
        <IconButton size="small">
          <MoreVertIcon sx={{ transform: 'rotate(90deg)' }} />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: '#1e293b',
          }}
        >
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
            borderRadius: '10px',
            px: 2,
            py: 1,
            fontWeight: 700,
            boxShadow: 'none',

            '&:hover': {
              backgroundColor: '#0284c7',
            },
          }}
        >
          Create New User
        </Button>
      </Stack>

      {/* STATS */}
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
          <StatCard
            title="Total Entry"
            value={totalDocs.toString()}
            icon={<GroupIcon />}
          />
        </Grid>
      </Grid>

      {/* TOOLBAR */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          placeholder="Search email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{
            width: { xs: '100%', md: 320 },
            backgroundColor: '#fff',
            borderRadius: '12px',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748b' }} />
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
              borderRadius: '12px',
              px: 2,
              py: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
              color: '#fff',
              boxShadow: '0 6px 20px rgba(15,23,42,0.35)',

              '&:hover': {
                background: 'linear-gradient(135deg,#1e293b 0%,#334155 100%)',
              },
            }}
          >
            Columns
          </Button>
        </Stack>
      </Stack>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '12px',
          boxShadow: 'none',
          border: '1px solid #e2e8f0',
        }}
      >
        <Table sx={{ minWidth: 850 }}>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              {visibleColumns.includes('id') && (
                <TableCell sx={tableHeadStyle}>ID</TableCell>
              )}

              {visibleColumns.includes('name') && (
                <TableCell sx={tableHeadStyle}>Name</TableCell>
              )}

              {visibleColumns.includes('email') && (
                <TableCell sx={tableHeadStyle}>Email</TableCell>
              )}

              {visibleColumns.includes('username') && (
                <TableCell sx={tableHeadStyle}>Username</TableCell>
              )}

              {visibleColumns.includes('phoneNumber') && (
                <TableCell sx={tableHeadStyle}>Phone Number</TableCell>
              )}

              {visibleColumns.includes('role') && (
                <TableCell sx={tableHeadStyle}>Role</TableCell>
              )}

              {visibleColumns.includes('status') && (
                <TableCell sx={tableHeadStyle}>Status</TableCell>
              )}

              {visibleColumns.includes('actions') && (
                <TableCell align="right" sx={tableHeadStyle}>
                  Actions
                </TableCell>
              )}
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
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                      },
                    }}
                  >
                    {visibleColumns.includes('id') && (
                      <TableCell sx={tableCellStyle}>
                        {(page - 1) * perPage + index + 1}
                      </TableCell>
                    )}

                    {visibleColumns.includes('name') && (
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color: '#1e293b',
                        }}
                      >
                        {user.fullName || user.username || user.email.split('@')[0]}
                      </TableCell>
                    )}

                    {visibleColumns.includes('email') && (
                      <TableCell sx={tableCellStyle}>{user.email}</TableCell>
                    )}

                    {visibleColumns.includes('username') && (
                      <TableCell sx={tableCellStyle}>
                        {user.username || user.email.split('@')[0]}
                      </TableCell>
                    )}

                    {visibleColumns.includes('phoneNumber') && (
                      <TableCell sx={tableCellStyle}>
                        {user.phoneNumber || '+91 98765 43210'}
                      </TableCell>
                    )}

                    {visibleColumns.includes('role') && (
                      <TableCell>
                        <Chip
                          label={
                            user.role === 'superadmin'
                              ? 'SUPER ADMIN'
                              : user.role.toUpperCase()
                          }
                          size="small"
                          sx={{
                            backgroundColor: roleStyle.bg,
                            color: roleStyle.text,
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            borderRadius: '6px',
                          }}
                        />
                      </TableCell>
                    )}

                    {visibleColumns.includes('status') && (
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
                              borderRadius: '999px',
                            }}
                          >
                            {user.active ? 'ACTIVE' : 'INACTIVE'}
                          </Typography>
                        </Stack>
                      </TableCell>
                    )}

                    {visibleColumns.includes('actions') && (
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openEdit(user.id)}>
                          <EditIcon
                            sx={{
                              fontSize: '1.25rem',
                              color: '#64748b',
                            }}
                          />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* FOOTER */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 2,
            borderTop: '1px solid #e2e8f0',
          }}
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
              '& .MuiPaginationItem-root': {
                fontWeight: 700,
              },

              '& .Mui-selected': {
                backgroundColor: '#1e293b !important',
                color: '#fff',
              },
            }}
          />
        </Stack>
      </TableContainer>

      {/* COLUMN MENU */}
<Menu
  anchorEl={columnAnchorEl}
  open={Boolean(columnAnchorEl)}
  onClose={() => setColumnAnchorEl(null)}
  PaperProps={{
    sx: {
      minWidth: 260,
      borderRadius: '20px',
      p: 1,
      mt: 1,
      background:
        'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96))',
      backdropFilter: 'blur(18px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow:
        '0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
    },
  }}
>
  <Box sx={{ px: 1, py: 1 }}>
    <Typography
      sx={{
        color: '#94a3b8',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        px: 1.5,
        mb: 1.5,
      }}
    >
      Toggle Columns
    </Typography>

    {[
      'id',
      'name',
      'email',
      'username',
      'phoneNumber',
      'role',
      'status',
      'actions',
    ].map((col) => {
      const active = visibleColumns.includes(col)

      return (
        <Box
          key={col}
          onClick={() => {
            setVisibleColumns((prev) =>
              prev.includes(col)
                ? prev.filter((c) => c !== col)
                : [...prev, col],
            )
          }}
          sx={{
            mb: 1,
            borderRadius: '14px',
            px: 1.5,
            py: 1.2,
            cursor: 'pointer',
            transition: '0.25s',
            backgroundColor: active
              ? 'rgba(56,189,248,0.15)'
              : 'transparent',

            border: active
              ? '1px solid #38bdf8'
              : '1px solid transparent',

            '&:hover': {
              backgroundColor: 'rgba(56,189,248,0.15)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#38bdf8',
                  boxShadow: active
                    ? '0 0 12px #38bdf8'
                    : 'none',
                }}
              />

              <Typography
                sx={{
                  color: active ? '#fff' : '#cbd5e1',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.88rem',
                  textTransform: 'capitalize',
                }}
              >
                {col}
              </Typography>
            </Stack>

            <Checkbox
              checked={active}
              size="small"
              sx={{
                color: '#94a3b8',

                '&.Mui-checked': {
                  color: '#38bdf8',
                },
              }}
            />
          </Stack>
        </Box>
      )
    })}
  </Box>
</Menu>

      {/* DRAWER */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: 400,
            p: 3,
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 800,
          }}
        >
          {drawerUserId ? 'Edit User' : 'Create User'}
        </Typography>

        <UserForm userId={drawerUserId} onSuccess={closeDrawer} />
      </Drawer>
    </Box>
  )
}

const tableHeadStyle = {
  fontWeight: 700,
  color: '#475569',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
}

const tableCellStyle = {
  color: '#64748b',
  fontSize: '0.875rem',
}