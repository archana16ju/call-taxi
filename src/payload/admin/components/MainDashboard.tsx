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

import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components to avoid SSR issues
import MapComponent, { MapMarker, MapPolyline } from './MapComponent'

let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
}

const taxiIcon = typeof window !== 'undefined' ? new L.DivIcon({
  className: 'custom-taxi-icon',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="width: 32px; height: 32px; background: #1e293b; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 2px solid #3b82f6; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);">
        <img src="https:/cdn-icons-png.flaticon.com/512/3448/3448339.png" style="width: 18px; height: 18px;" />
      </div>
      <div style="margin-top: 2px; background: #fff; color: #1e293b; padding: 1px 4px; border-radius: 3px; font-size: 7px; font-weight: 800; text-transform: uppercase;">
        On Route
      </div>
    </div>
  `,
  iconSize: [40, 50],
  iconAnchor: [20, 50]
}) : null;

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
  <Paper sx={{ p: 2, borderRadius: '16px', backgroundColor: 'var(--theme-bg-card)', border: '1px solid var(--theme-border-color)', backgroundImage: 'none' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)', fontWeight: 600, fontSize: '0.75rem' }}>{title}</Typography>
        <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 700, color: 'var(--theme-text)' }}>{value}</Typography>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
          {trend === 'up' ? <TrendingUpIcon sx={{ fontSize: '1rem', color: '#10b981' }} /> : <TrendingDownIcon sx={{ fontSize: '1rem', color: '#ef4444' }} />}
          <Typography variant="caption" sx={{ color: trend === 'up' ? '#10b981' : '#ef4444', fontWeight: 700 }}>{trendValue}</Typography>
          <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>from last week</Typography>
        </Stack>
      </Box>
      <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: `${color}33`, color: color }}>
        {icon}
      </Box>
    </Stack>
  </Paper>
)

export default function MainDashboard() {
  const [tabValue, setTabValue] = React.useState(0)
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
              const osrm = `https:/router.project-osrm.org/route/v1/driving/${driver.location[0]},${driver.location[1]};${booking.dropoffLocation[0]},${booking.dropoffLocation[1]}?overview=full&geometries=geojson`
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
    <Box sx={{ p: 3, backgroundColor: 'var(--theme-bg-page)', minHeight: '100vh', color: 'var(--theme-text)' }}>
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
      {/* Top Bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Dashboard Overview</Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Paper sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            px: 2, 
            py: 1, 
            borderRadius: '12px', 
            backgroundColor: 'var(--theme-elevation-50)', 
            border: '1px solid var(--theme-border-color)' 
          }}>
            <CalendarTodayIcon sx={{ fontSize: '1rem', mr: 1, color: 'var(--theme-text-secondary)' }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{currentDate}</Typography>
          </Paper>
          <Box sx={{ position: 'relative' }}>
            <IconButton 
              onClick={handleBellClick}
              sx={{ backgroundColor: 'var(--theme-elevation-50)', border: '1px solid var(--theme-border-color)' }}
            >
              <NotificationsNoneIcon sx={{ color: 'var(--theme-text)' }} />
              {unreadCount > 0 && (
                <Box sx={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, backgroundColor: '#ef4444', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, border: '2px solid var(--theme-bg-page)' }}>
                  {unreadCount}
                </Box>
              )}
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleBellClose}
              PaperProps={{
                sx: { 
                  mt: 1.5, 
                  width: 320, 
                  borderRadius: '16px', 
                  backgroundColor: 'var(--theme-bg-card)', 
                  border: '1px solid var(--theme-border-color)',
                  backgroundImage: 'none',
                  color: 'var(--theme-text)'
                }
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Notifications</Typography>
                <Divider sx={{ mb: 1.5 }} />
                <Stack spacing={2}>
                  {alertsList.length > 0 ? alertsList.map((alert, i) => (
                    <Box key={i} sx={{ p: 1, borderRadius: '8px', '&:hover': { backgroundColor: 'var(--theme-elevation-50)' } }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{alert.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)', display: 'block' }}>{alert.message}</Typography>
                    </Box>
                  )) : (
                    <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)', p: 2, textAlign: 'center' }}>No new notifications</Typography>
                  )}
                </Stack>
                <Button fullWidth size="small" component={Link} href="/admin/collections/alerts" sx={{ mt: 2, textTransform: 'none' }}>View All Notifications</Button>
              </Box>
            </Menu>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 40, height: 40, backgroundColor: '#fbbf24' }}>AD</Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>Administrator</Typography>
              <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>System Control</Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid size={{ xs: 12, md: 2.4 }}>
          <StatCard title="Total Bookings" value={stats.totalBookings} trend="up" trendValue="Live" icon={<BookIcon />} color="#3b82f6" />
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <StatCard title="Completed Bookings" value={stats.completedBookings} trend="up" trendValue="Live" icon={<LocalTaxiIcon />} color="#10b981" />
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <StatCard title="Ongoing Bookings" value={stats.ongoingBookings} trend="up" trendValue="Live" icon={<AccessTimeIcon />} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <StatCard title="Total Revenue" value={stats.totalRevenue} trend="up" trendValue="Live" icon={<PaymentsIcon />} color="#8b5cf6" />
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <StatCard title="Avg. Rating" value={stats.avgRating} trend="up" trendValue="Live" icon={<StarIcon />} color="#f43f5e" />
        </Grid>

        {/* Driver Status & Map */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, borderRadius: '16px', backgroundColor: 'var(--theme-bg-card)', border: '1px solid var(--theme-border-color)', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Real-Time Driver Status</Typography>
              <Button size="small" component={Link} href="/admin/collections/drivers" sx={{ textTransform: 'none', color: '#3b82f6' }}>View All</Button>
            </Stack>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 2, minHeight: 40 }}>
              <Tab label="Drivers" sx={{ textTransform: 'none', minHeight: 40 }} />
            </Tabs>
            <Stack spacing={2}>
              {driversList.length > 0 ? driversList.map((driver, i) => (
                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32 }}>{driver.name[0]}</Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: 'var(--theme-text)' }}>{driver.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>{driver.status}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Typography variant="caption" sx={{ color: driver.status === 'available' ? '#10b981' : driver.status === 'driving' ? '#3b82f6' : '#ef4444' }}>
                      ● {driver.status}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{driver.phone}</Typography>
                  </Stack>
                </Stack>
              )) : (
                <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)', textAlign: 'center', py: 4 }}>No drivers found</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2, borderRadius: '16px', backgroundColor: 'var(--theme-bg-card)', border: '1px solid var(--theme-border-color)', height: '100%', position: 'relative', overflow: 'hidden' }}>
             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Live Fleet Tracking</Typography>
              <Button component={Link} href="/admin/live-tracking" size="small" sx={{ textTransform: 'none', color: '#3b82f6' }}>View Full Map</Button>
            </Stack>
            <Box sx={{ 
              height: 250, 
              backgroundColor: 'var(--theme-elevation-100)', 
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 0
            }}>
              <MapComponent 
                center={[13.0827, 80.2707]}
                zoom={12}
                polylines={Object.entries(activeRoutes).map(([id, positions]) => ({
                  id,
                  positions: positions as [number, number][],
                  color: '#3b82f6',
                  weight: 3,
                  opacity: 0.6,
                  dashArray: '5, 10'
                }))}
                markers={driverLocations
                  .filter(loc => loc.location && Array.isArray(loc.location) && loc.location.length >= 2)
                  .map((loc) => ({
                    id: loc.id,
                    position: [loc.location[1], loc.location[0]],
                    icon: taxiIcon,
                    popup: (
                      <Box sx={{ p: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: '#000' }}>Driver: {loc.name}</Typography>
                        {loc.assignedVehicle && (
                          <Typography variant="caption" sx={{ display: 'block', color: '#3b82f6', fontWeight: 700 }}>
                            Car: {typeof loc.assignedVehicle === 'object' ? loc.assignedVehicle.name : 'Assigned'}
                          </Typography>
                        )}
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Status: {loc.status}</Typography>
                        {loc.lastUpdated && (
                          <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontSize: '0.6rem' }}>
                            Last seen: {new Date(loc.lastUpdated).toLocaleTimeString()}
                          </Typography>
                        )}
                      </Box>
                    )
                  }))}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2, borderRadius: '16px', backgroundColor: 'var(--theme-bg-card)', border: '1px solid var(--theme-border-color)', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Alerts Center</Typography>
              <Button size="small" component={Link} href="/admin/collections/alerts" sx={{ textTransform: 'none', color: '#3b82f6' }}>View All</Button>
            </Stack>
            <Stack spacing={2}>
              {alertsList.length > 0 ? alertsList.map((alert, i) => (
                <Stack key={i} direction="row" spacing={1.5}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '8px', backgroundColor: alert.type === 'emergency' ? '#ef444433' : '#3b82f633', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <NotificationsNoneIcon sx={{ color: alert.type === 'emergency' ? '#ef4444' : '#3b82f6', fontSize: '1.25rem' }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--theme-text)' }}>{alert.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)', display: 'block', fontSize: '0.7rem' }}>{alert.message}</Typography>
                  </Box>
                </Stack>
              )) : (
                <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)', textAlign: 'center', py: 4 }}>No recent alerts</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Quick Access Grid */}
        <Grid size={{ xs: 12 }}>
           <Grid container spacing={2}>
             {[
               { label: 'Payment Settings', sub: 'Advance & methods', icon: <PaymentsIcon />, color: '#8b5cf6', path: '/admin/globals/payment-settings' },
               { label: 'WhatsApp Support', sub: 'Chat with customers', icon: <WhatsAppIcon />, color: '#10b981', path: '/admin/globals/general-settings' },
               { label: 'Cancellation Control', sub: 'Rules & penalties', icon: <CancelIcon />, color: '#ef4444', path: '/admin/globals/cancellation-control' },
                { label: 'Vehicles', sub: 'Manage vehicle fleet', icon: <LocalShippingIcon  />, color: '#ec4899', path: '/admin/collections/vehicles' },
               { label: 'Media Gallery', sub: 'Banners & branding', icon: <CollectionsIcon />, color: '#22c55e', path: '/admin/collections/media' },
               { label: 'Users & Roles', sub: 'Manage all users', icon: <AdminPanelSettingsIcon />, color: '#6366f1', path: '/admin/collections/users' },
             ].map((item, i) => (
               <Grid size={{ xs: 6, md: 2 }} key={i}>
                 <Link href={item.path} style={{ textDecoration: 'none' }}>
                   <Paper sx={{ p: 2, borderRadius: '16px', backgroundColor: 'var(--theme-bg-card)', border: '1px solid var(--theme-border-color)', textAlign: 'center', cursor: 'pointer', transition: '0.2s', '&:hover': { backgroundColor: 'var(--theme-elevation-50)' } }}>
                     <Box sx={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: `${item.color}33`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                       {item.icon}
                     </Box>
                     <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', lineHeight: 1.2, color: 'var(--theme-text)' }}>{item.label}</Typography>
                     <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)', fontSize: '0.65rem' }}>{item.sub}</Typography>
                   </Paper>
                 </Link>
               </Grid>
             ))}
           </Grid>
        </Grid>

        {/* Charts Row */}
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
