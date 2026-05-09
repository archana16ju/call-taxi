'use client'

import React from 'react'
import Link from 'next/link'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Menu,
  TextField,
  Badge,
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

import LocalShippingIcon from '@mui/icons-material/LocalShipping'

React.useEffect(() => {
  import('leaflet/dist/leaflet.css')
}, [])
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components to avoid SSR issues
const MapComponent = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
  },
)

import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SearchIcon from '@mui/icons-material/Search'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import BookIcon from '@mui/icons-material/Book'
import PeopleIcon from '@mui/icons-material/People'
import PaymentsIcon from '@mui/icons-material/Payments'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StarIcon from '@mui/icons-material/Star'
import MapIcon from '@mui/icons-material/Map'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import CancelIcon from '@mui/icons-material/Cancel'
import LocalActivityIcon from '@mui/icons-material/LocalActivity'
import SettingsIcon from '@mui/icons-material/Settings'
import CollectionsIcon from '@mui/icons-material/Collections'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import LocationTracker from './LocationTracker'

const StatCard = ({ title, value, trend, trendValue, icon, color }: any) => (
  <Paper sx={{ 
    p: 2, 
    borderRadius: '16px', 
    backgroundColor: '#ffffff', 
    border: '1px solid #e2e8f0', 
    transition: 'all 0.2s',
    '&:hover': { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
  }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ 
        p: 1.5, 
        borderRadius: '12px', 
        backgroundColor: `${color}15`, 
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {React.cloneElement(icon as React.ReactElement, { sx: { fontSize: '1.8rem' } } as any)}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.7rem', display: 'block' }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', my: 0.2 }}>
          {value}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {trend === 'up' ? <TrendingUpIcon sx={{ fontSize: '0.9rem', color: '#10b981' }} /> : <TrendingDownIcon sx={{ fontSize: '0.9rem', color: '#ef4444' }} />}
          <Typography variant="caption" sx={{ color: trend === 'up' ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '0.65rem' }}>
            {trendValue}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>from last week</Typography>
        </Stack>
      </Box>
    </Stack>
  </Paper>
)

export default function MainDashboard() {
  const [tabValue, setTabValue] = React.useState(0)
  const [searchTerm, setSearchTerm] = React.useState('')
const [liveDateTime, setLiveDateTime] = React.useState('')

React.useEffect(() => {
  const updateClock = () => {
    const now = new Date()

    setLiveDateTime(
      now.toLocaleString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    )
  }

  updateClock()

  const timer = setInterval(updateClock, 1000)

  return () => clearInterval(timer)
}, [])
  const [stats, setStats] = React.useState({
    
    totalBookings: '0',
    completedBookings: '0',
    ongoingBookings: '0',
    totalRevenue: '₹ 0',
    avgRating: '0.0',
    totalCustomers: '0',
    couponsUsed: '0',
    cancelledBookings: '0'
  })
  const [driversList, setDriversList] = React.useState<any[]>([])
  const [alertsList, setAlertsList] = React.useState<any[]>([])
  const [driverLocations, setDriverLocations] = React.useState<any[]>([])
  const [activeRoutes, setActiveRoutes] = React.useState<Record<string, any>>({})
  const [loading, setLoading] = React.useState(true)

  const [currentDate, setCurrentDate] = React.useState('')
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [taxiIcon, setTaxiIcon] = React.useState<any>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        setTaxiIcon(new L.DivIcon({
          className: 'custom-taxi-icon',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 32px; height: 32px; background: #1e293b; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 2px solid #3b82f6; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);">
                <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" style="width: 18px; height: 18px;" />
              </div>
              <div style="margin-top: 2px; background: #fff; color: #1e293b; padding: 1px 4px; border-radius: 3px; font-size: 7px; font-weight: 800; text-transform: uppercase;">
                On Route
              </div>
            </div>
          `,
          iconSize: [40, 50],
          iconAnchor: [20, 50]
        }))
      })
    }
  }, [])

  const fetchLocations = React.useCallback(async () => {
    try {
      const driversRes = await fetch('/api/drivers?where[location][exists]=true&limit=100').then(res => {
        if (!res.ok) throw new Error('Failed to fetch drivers')
        return res.json()
      })
      setDriverLocations(driversRes.docs)

      // Fetch active bookings for routes
      const bookingsRes = await fetch('/api/bookings?where[status][equals]=confirmed&limit=100').then(res => {
        if (!res.ok) throw new Error('Failed to fetch bookings')
        return res.json()
      })
      
      const routePromises = driversRes.docs.map(async (driver: any) => {
        if (driver.status === 'driving' && driver.location && Array.isArray(driver.location)) {
          const booking = bookingsRes.docs.find((b: any) => {
            const bDriverId = typeof b.driver === 'object' ? b.driver?.id : b.driver;
            return bDriverId === driver.id;
          });

          if (booking && booking.dropoffLocation && Array.isArray(booking.dropoffLocation)) {
            try {
             const osrm = `https://router.project-osrm.org/route/v1/driving/${driver.location[0]},${driver.location[1]};${booking.dropoffLocation[0]},${booking.dropoffLocation[1]}?overview=full&geometries=geojson`
              const routeRes = await fetch(osrm).then(res => {
                if (!res.ok) return null
                return res.json()
              })
              if (routeRes && routeRes.routes && routeRes.routes[0]) {
                return { id: driver.id, coords: routeRes.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]) }
              }
            } catch (e) {
              console.warn(`Error fetching route for driver ${driver.id}:`, e)
            }
          }
        }
        return { id: driver.id, coords: null }
      })

      const results = await Promise.all(routePromises)
      setActiveRoutes(prev => {
        const next = { ...prev }
        results.forEach(res => {
          if (res.coords) {
            next[res.id] = res.coords
          } else {
            delete next[res.id]
          }
        })
        return next
      })
    } catch (e) {
      console.error('fetchLocations failed:', e)
    }
  }, [])

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      // Set current date
      const now = new Date()
      setCurrentDate(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }))

      const [allBookings, completed, confirmed, cancelled, customers, reviews, driversData, alertsData, unreadAlerts] = await Promise.all([
        fetch('/api/bookings?limit=0').then(res => res.json()),
        fetch('/api/bookings?where[status][equals]=completed&limit=0').then(res => res.json()),
        fetch('/api/bookings?where[status][equals]=confirmed&limit=0').then(res => res.json()),
        fetch('/api/bookings?where[status][equals]=cancelled&limit=0').then(res => res.json()),
        fetch('/api/customers?limit=0').then(res => res.json()),
        fetch('/api/reviews?limit=100').then(res => res.json()),
        fetch('/api/drivers?limit=5').then(res => res.json()),
        fetch('/api/alerts?limit=5&sort=-createdAt').then(res => res.json()),
        fetch('/api/alerts?where[isRead][equals]=false&limit=0').then(res => res.json()),
      ])

      const revenueDocs = await fetch('/api/bookings?where[status][equals]=completed&limit=100&select[paymentAmount]=true').then(res => res.json())
      const totalRev = revenueDocs.docs.reduce((acc: number, doc: any) => acc + (Number(doc.paymentAmount) || 0), 0)

      const avg = reviews.docs.length > 0 
        ? (reviews.docs.reduce((acc: number, doc: any) => acc + (Number(doc.rating) || 0), 0) / reviews.docs.length).toFixed(1)
        : '0.0'

      setStats({
        totalBookings: allBookings.totalDocs.toLocaleString(),
        completedBookings: completed.totalDocs.toLocaleString(),
        ongoingBookings: confirmed.totalDocs.toLocaleString(),
        totalRevenue: `₹ ${totalRev.toLocaleString()}`,
        avgRating: avg,
        totalCustomers: customers.totalDocs.toLocaleString(),
        couponsUsed: '0',
        cancelledBookings: cancelled.totalDocs.toLocaleString()
      })

      setDriversList(driversData.docs)
      setAlertsList(alertsData.docs)
      setUnreadCount(unreadAlerts.totalDocs)
      await fetchLocations()
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }, [fetchLocations])

  React.useEffect(() => {
    fetchData()
    const interval = setInterval(fetchLocations, 5000)
    return () => clearInterval(interval)
  }, [fetchData, fetchLocations])

  const handleBellClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleBellClose = () => {
    setAnchorEl(null)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--theme-bg-page)' }}>
        <CircularProgress sx={{ color: '#fbbf24' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: 'var(--theme-bg-page)', minHeight: '100%', color: 'var(--theme-text)' }}>
      <LocationTracker />
      <style>{`
        .leaflet-tile-container {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-container {
          background: #0f172a !important;
          border-radius: 12px;
        }
      `}</style>
      {/* Modern Top Navbar */}
<Paper
  elevation={0}
  sx={{
    px: 3,
    py: 1.5,
    mb: 3,
    borderRadius: 0,
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  }}
>
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    spacing={2}
    alignItems={{ xs: 'stretch', md: 'center' }}
    justifyContent="space-between"
  >
    {/* Left Side */}
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', md: 'center' }}
      sx={{ flexGrow: 1 }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '-0.5px',
        }}
      >
        Main Dashboard
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search bookings, drivers, users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          maxWidth: 420,
          '& .MuiOutlinedInput-root': {
            borderRadius: '14px',
            backgroundColor: '#f8fafc',
          },
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon
              sx={{
                color: '#64748b',
                mr: 1,
              }}
            />
          ),
        }}
      />
    </Stack>

    {/* Right Side */}
    <Stack direction="row" spacing={2} alignItems="center">
      {/* Live Date */}
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1,
          borderRadius: '12px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarTodayIcon
            sx={{
              fontSize: 18,
              color: '#475569',
            }}
          />

          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: '#0f172a',
              fontSize: '0.72rem',
            }}
          >
            {liveDateTime}
          </Typography>
        </Stack>
      </Paper>

      {/* Notifications */}
      <Link href="/admin/collections/alerts">
        <IconButton
          sx={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            '&:hover': {
              backgroundColor: '#eff6ff',
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
      </Link>

      {/* Administrator */}
      <Link
        href="/admin/collections/users"
        style={{ textDecoration: 'none' }}
      >
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{
            px: 1.2,
            py: 0.6,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background:
                'linear-gradient(135deg,#3b82f6,#6366f1)',
              fontWeight: 900,
              fontSize: '0.8rem',
            }}
          >
            AD
          </Avatar>

          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                display: 'block',
                lineHeight: 1.2,
              }}
            >
              Administrator
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontSize: '0.65rem',
              }}
            >
              Manage Users
            </Typography>
          </Box>
        </Stack>
      </Link>
    </Stack>
  </Stack>
</Paper>


      <Grid container spacing={3} sx={{ px: 3, pb: 3 }}>
        {/* Stat Cards - Exactly like Image */}
        <Grid size={{ xs: 12, sm: 6, lg: 2, xl: 2.4 }}>
          <StatCard title="Total Bookings" value={stats.totalBookings.toLocaleString()} trend="up" trendValue="+13.6%" icon={<BookIcon />} color="#3b82f6" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6,lg: 2, xl: 2.4 }}>
          <StatCard title="Completed" value={stats.completedBookings.toLocaleString()} trend="up" trendValue="+15.2%" icon={<LocalTaxiIcon />} color="#10b981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2, xl: 2.4  }}>
          <StatCard title="Ongoing" value={stats.ongoingBookings.toLocaleString()} trend="down" trendValue="-6.2%" icon={<AccessTimeIcon />} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2, xl: 2.4  }}>
          <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} trend="up" trendValue="+22.8%" icon={<PaymentsIcon />} color="#8b5cf6" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2, xl: 2.4 }}>
          <StatCard title="Avg. Rating" value={stats.avgRating} trend="up" trendValue="4.6" icon={<StarIcon />} color="#f43f5e" />
        </Grid>

        {/* Main Widgets Row */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>Driver & Vehicle Status</Typography>
              <Button size="small" component={Link} href="/admin/collections/drivers" sx={{ textTransform: 'none', color: '#3b82f6', fontWeight: 700 }}>View All</Button>
            </Stack>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2, minHeight: 36, '& .MuiTab-root': { textTransform: 'none', fontWeight: 800, minHeight: 36, fontSize: '0.75rem' } }}>
              <Tab label="Drivers" />
              <Tab label="Vehicles" />
            </Tabs>
            <Stack spacing={2}>
              {driversList.length > 0 ? driversList.map((driver, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1, borderRadius: '10px', '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', fontWeight: 800 }}>{driver.name[0]}</Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b', display: 'block' }}>{driver.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>{driver.phone}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" sx={{ fontWeight: 800, color: driver.status === 'available' ? '#10b981' : '#3b82f6', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                       <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }} />
                       {driver.status.toUpperCase()}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.65rem', backgroundColor: '#f1f5f9', px: 1, py: 0.3, borderRadius: '4px' }}>TN01AB1234</Typography>
                  </Stack>
                </Stack>
              )) : (
                <Typography variant="caption" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>No data found</Typography>
              )}
            </Stack>
            
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={1}>
              <Grid size={3}><Box sx={{ p: 1, textAlign: 'center', borderRadius: '8px', backgroundColor: '#f8fafc' }}><Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.6rem' }}>Total Drivers</Typography><Typography variant="body2" sx={{ fontWeight: 900 }}>128</Typography></Box></Grid>
              <Grid size={3}><Box sx={{ p: 1, textAlign: 'center', borderRadius: '8px', backgroundColor: '#f0fdf4' }}><Typography variant="caption" sx={{ color: '#10b981', display: 'block', fontSize: '0.6rem' }}>Online</Typography><Typography variant="body2" sx={{ fontWeight: 900, color: '#10b981' }}>96</Typography></Box></Grid>
              <Grid size={3}><Box sx={{ p: 1, textAlign: 'center', borderRadius: '8px', backgroundColor: '#fef2f2' }}><Typography variant="caption" sx={{ color: '#ef4444', display: 'block', fontSize: '0.6rem' }}>Offline</Typography><Typography variant="body2" sx={{ fontWeight: 900, color: '#ef4444' }}>32</Typography></Box></Grid>
              <Grid size={3}><Box sx={{ p: 1, textAlign: 'center', borderRadius: '8px', backgroundColor: '#f5f3ff' }}><Typography variant="caption" sx={{ color: '#8b5cf6', display: 'block', fontSize: '0.6rem' }}>Vehicles</Typography><Typography variant="body2" sx={{ fontWeight: 900, color: '#8b5cf6' }}>85</Typography></Box></Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
  <Paper
    sx={{
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      height: '100%',
    }}
  >
    {/* Header */}
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 900,
            color: '#1e293b',
          }}
        >
          Live GPS Tracking
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: '#64748b',
          }}
        >
          Real-time driver tracking
        </Typography>
      </Box>

      <Button
        component={Link}
        href="/admin/live-tracking"
        size="small"
        sx={{
          textTransform: 'none',
          fontWeight: 800,
        }}
      >
        Open Full Map
      </Button>
    </Box>

    {/* Map */}
    <Box sx={{ height: 320 }}>
      <MapComponent
        center={[13.0827, 80.2707]}
        zoom={12}
        polylines={Object.entries(activeRoutes).map(
          ([id, positions]) => ({
            id,
            positions: positions as [number, number][],
            color: '#3b82f6',
            weight: 3,
          }),
        )}
        markers={driverLocations
          .filter(
            (d) =>
              d.location &&
              Array.isArray(d.location),
          )
          .map((d) => ({
            id: d.id,
            position: [
              d.location[1],
              d.location[0],
            ],
          }))}
      />
    </Box>

    {/* Bottom */}
    <Stack
      direction="row"
      justifyContent="space-around"
      sx={{
        py: 1.5,
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
      }}
    >
      <Box textAlign="center">
        <Typography
          sx={{
            fontWeight: 900,
            color: '#3b82f6',
          }}
        >
          {driverLocations.length}
        </Typography>

        <Typography variant="caption">
          Drivers
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box textAlign="center">
        <Typography
          sx={{
            fontWeight: 900,
            color: '#10b981',
          }}
        >
          {Object.keys(activeRoutes).length}
        </Typography>

        <Typography variant="caption">
          On Trip
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box textAlign="center">
        <Typography
          sx={{
            fontWeight: 900,
            color: '#f59e0b',
          }}
        >
          LIVE
        </Typography>

        <Typography variant="caption">
          Status
        </Typography>
      </Box>
    </Stack>
  </Paper>
</Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper sx={{ p: 2.5, borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>Alerts Center</Typography>
              <Button size="small" component={Link} href="/admin/collections/alerts" sx={{ textTransform: 'none', color: '#3b82f6', fontWeight: 700 }}>View All</Button>
            </Stack>
            <Stack spacing={2}>
              {[
                { title: 'SOS Alert', msg: 'Driver Suresh Babu triggered SOS', type: 'sos', color: '#ef4444', icon: <NotificationsNoneIcon /> },
                { title: 'High Cancellation', msg: 'Driver Karthik has high cancellation', type: 'warn', color: '#f59e0b', icon: <NotificationsNoneIcon /> },
                { title: 'Payment Pending', msg: '12 payments are pending', type: 'pay', color: '#3b82f6', icon: <NotificationsNoneIcon /> },
                { title: 'New Booking', msg: 'New booking #BK-250526-1248', type: 'book', color: '#10b981', icon: <NotificationsNoneIcon /> },
              ].map((alert, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ p: 1, borderRadius: '10px', backgroundColor: `${alert.color}15`, color: alert.color }}>
                    {alert.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#1e293b', display: 'block' }}>{alert.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem', display: 'block' }}>{alert.msg}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Button fullWidth sx={{ mt: 3, py: 1, borderRadius: '10px', textTransform: 'none', fontWeight: 800, color: '#ef4444', backgroundColor: '#fef2f2', '&:hover': { backgroundColor: '#fee2e2' } }}>View All Alerts</Button>
          </Paper>
        </Grid>

        {/* Quick Access Grid - White Icons */}
        <Grid size={{ xs: 12 }}>
           <Grid container spacing={3} sx={{ mt: 1 }}>
             {[
               { label: 'Coupons & Discounts', sub: 'Manage coupons', icon: <BookIcon />, color: '#3b82f6', path: '/admin/collections/coupons' },
               { label: 'Payment Settings', sub: 'Advance & methods', icon: <PaymentsIcon />, color: '#8b5cf6', path: '/admin/globals/payment-settings' },
               { label: 'WhatsApp Support', sub: 'Chat with customers', icon: <WhatsAppIcon />, color: '#10b981', path: '/admin/globals/general-settings' },
               { label: 'Cancellation Control', sub: 'Rules & penalties', icon: <CancelIcon />, color: '#ef4444', path: '/admin/globals/cancellation-control' },
               { label: 'Media & Sliders', sub: 'Banners & branding', icon: <CollectionsIcon />, color: '#ec4899', path: '/admin/collections/media' },
               { label: 'Users & Roles', sub: 'Manage all users', icon: <PeopleIcon />, color: '#6366f1', path: '/admin/collections/users' },
             ].map((item, i) => (
               <Grid size={{ xs: 6, sm: 4, lg: 2 }} key={i}>
                 <Link href={item.path} style={{ textDecoration: 'none' }}>
                   <Paper sx={{ 
                     p: 2, 
                     borderRadius: '12px', 
                     backgroundColor: '#ffffff', 
                     border: '1px solid #e2e8f0', 
                     textAlign: 'left', 
                     display: 'flex',
                     gap: 1.5,
                     alignItems: 'center',
                     cursor: 'pointer', 
                     transition: '0.2s', 
                     '&:hover': { backgroundColor: '#f8fafc' } 
                   }}>
                     <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       {item.icon}
                     </Box>
                     <Box>
                       <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', color: '#1e293b', fontSize: '0.7rem' }}>{item.label}</Typography>
                       <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.6rem' }}>{item.sub}</Typography>
                     </Box>
                   </Paper>
                 </Link>
               </Grid>
             ))}
           </Grid>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: '16px', backgroundColor: 'var(--theme-bg-card)', border: '1px solid var(--theme-border-color)' }}>
             <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>Live Booking Trends</Typography>
             <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--theme-text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--theme-text-secondary)' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
                <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)', textAlign: 'center', display: 'block', mt: -15 }}>Aggregation in progress...</Typography>
             </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={3}>
             <Grid size={{ xs: 12, md: 6 }}>
               <StatCard title="Total Customers" value={stats.totalCustomers} trend="up" trendValue="Live" icon={<PeopleIcon />} color="#3b82f6" />
             </Grid>
             <Grid size={{ xs: 12, md: 6 }}>
               <StatCard title="Cancelled Bookings" value={stats.cancelledBookings} trend="down" trendValue="Live" icon={<CancelIcon />} color="#ef4444" />
             </Grid>
             <Grid size={{ xs: 12, md: 12 }}>
                <Paper sx={{ p: 3, borderRadius: '16px', backgroundColor: 'var(--theme-bg-card)', border: '1px solid var(--theme-border-color)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Revenue Overview</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>All data is pulled directly from your active collections.</Typography>
                </Paper>
             </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center', pb: 2 }}>
        <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>
          © 2025 Taxi Services. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
