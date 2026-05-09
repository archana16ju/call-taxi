'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import BookIcon from '@mui/icons-material/Book'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PaymentsIcon from '@mui/icons-material/Payments'
import StarRateIcon from '@mui/icons-material/StarRate'
import LocalActivityIcon from '@mui/icons-material/LocalActivity'
import NotificationsIcon from '@mui/icons-material/Notifications'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import CancelIcon from '@mui/icons-material/Cancel'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CollectionsIcon from '@mui/icons-material/Collections'
import MicIcon from '@mui/icons-material/Mic'
import HubIcon from '@mui/icons-material/Hub'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import HistoryIcon from '@mui/icons-material/History'
import SecurityIcon from '@mui/icons-material/Security'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ShareIcon from '@mui/icons-material/Share'
import StarIcon from '@mui/icons-material/Star'

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { type: 'header', label: 'MANAGEMENT' },
  { label: 'Users & Roles', icon: <AdminPanelSettingsIcon />, path: '/admin/collections/users' },
  { label: 'Drivers', icon: <PeopleIcon />, path: '/admin/collections/drivers' },
  { label: 'Customers', icon: <PeopleIcon />, path: '/admin/collections/customers' },
  { label: 'Sliders', icon: <CollectionsIcon />, path: '/admin/collections/slider-images' },
  { label: 'Media Gallery', icon: <CollectionsIcon />, path: '/admin/collections/media' },
  { label: 'Vehicles', icon: <LocalTaxiIcon />, path: '/admin/collections/vehicles' },
  { type: 'header', label: 'SMART BOOKING' },
  { label: 'Bookings', icon: <BookIcon />, path: '/admin/collections/bookings' },
  { label: 'Driver Allocation', icon: <HubIcon />, path: '/admin/driver-allocation' },
  { label: 'Voice Dispatch', icon: <MicIcon />, path: '/admin/voice-dispatch' },
  { label: 'Smart Ride', icon: <AutoAwesomeIcon />, path: '/admin/collections/ride-preferences' },
  { type: 'header', label: 'LIVE TRACKING SYSTEM' },
  { label: 'Live GPS Tracking', icon: <GpsFixedIcon />, path: '/(frontend)/live-tracking' },
  {
    label: 'Offline Sync Logs',
    icon: <HistoryIcon />,
    path: '/admin/collections/driver-offline-logs',
  },
  { type: 'header', label: 'SMART COMMUNICATION' },
  { label: 'Support (WhatsApp)', icon: <WhatsAppIcon />, path: '/admin/globals/general-settings' },
  {
    label: 'AI Chat Support',
    icon: <WhatsAppIcon />,
    path: '/admin/collections/ai-chat-conversations',
  },
  { label: 'Voice Support', icon: <MicIcon />, path: '/admin/collections/voice-bookings' },
  { type: 'header', label: 'SECURITY SYSTEM' },
  {
    label: 'Cancellation Control',
    icon: <CancelIcon />,
    path: '/admin/globals/cancellation-control',
  },
  { label: 'Trip OTPs', icon: <SecurityIcon />, path: '/admin/collections/trip-otps' },
  { label: 'Trip Sharing', icon: <ShareIcon />, path: '/admin/collections/trip-sharing' },
  { type: 'header', label: 'FINANCIAL SETTLEMENTS' },
  {
    label: 'Revenue & Settlements',
    icon: <AccountBalanceWalletIcon />,
    path: '/admin/collections/revenue-settlements',
  },
  { type: 'header', label: 'ACCOUNTS' },
  { label: 'Invoices', icon: <ReceiptIcon />, path: '/admin/collections/invoices' },
  { label: 'Payment Settings', icon: <PaymentsIcon />, path: '/admin/globals/payment-settings' },
  { label: 'Payment Methods', icon: <PaymentsIcon />, path: '/admin/collections/payment-methods' },
  { label: 'Tariffs', icon: <MonetizationOnIcon />, path: '/admin/collections/tariffs' },
  { label: 'Coupons & Discounts', icon: <LocalActivityIcon />, path: '/admin/collections/coupons' },
  { type: 'header', label: 'NOTIFICATIONS' },
  { label: 'Alerts Center', icon: <NotificationsIcon />, path: '/admin/collections/alerts' },
  { label: 'Contact Inquiries', icon: <ContactMailIcon />, path: '/admin/collections/contacts' },
  { type: 'header', label: 'REPORTS' },
  { label: 'Customer Reports', icon: <AssessmentIcon />, path: '/admin/globals/customer-report' },
  { label: 'Booking Reports', icon: <AssessmentIcon />, path: '/admin/globals/booking-report' },
  { label: 'Vehicle Reports', icon: <AssessmentIcon />, path: '/admin/globals/vehicle-report' },
  { type: 'header', label: 'FEEDBACKS' },
  { label: 'Ratings & Reviews', icon: <StarRateIcon />, path: '/admin/collections/reviews' },
]

export const CustomNav: React.FC = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  React.useEffect(() => {
    document.documentElement.style.setProperty('--nav-width', isCollapsed ? '70px' : '280px')
  }, [isCollapsed])

  const navWidth = isCollapsed ? 70 : 280

  return (
    <Box
      sx={{
        width: navWidth,
        height: '100%',
        backgroundColor: '#0a192f',
        color: '#ffffff',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Premium Header */}
      <Box
        sx={{
          p: isCollapsed ? 1.5 : 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          mb: 2,
        }}
      >
        <Box
          onClick={toggleCollapse}
          sx={{
            width: 44,
            height: 44,
            backgroundColor: '#fbbf24',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'transform 0.2s',
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
            '&:hover': {
              backgroundColor: '#f59e0b',
              transform: 'scale(1.05)',
            },
          }}
        >
          <LocalTaxiIcon sx={{ color: '#000000', fontSize: '1.8rem' }} />
        </Box>
        {!isCollapsed && (
          <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff' }}
            >
              Taxi System
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Advanced Premium
            </Typography>
          </Box>
        )}
      </Box>

      <List sx={{ px: isCollapsed ? 1 : 2, pb: 4, pt: 0 }}>
        {menuItems.map((item, index) => {
          if (item.type === 'header') {
            if (isCollapsed)
              return (
                <Divider
                  key={index}
                  sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.05)', mx: 1 }}
                />
              )
            return (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 3,
                  mb: 1.5,
                  px: 2,
                  color: '#475569',
                  fontWeight: 800,
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Typography>
            )
          }

          const active = pathname === item.path

          return (
            <Link
              href={item.path || '#'}
              key={index}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem disablePadding sx={{ mb: 0.8, display: 'block' }}>
                <ListItemButton
                  sx={{
                    borderRadius: '10px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    alignItems: 'center',
                    px: isCollapsed ? 0 : 2,
                    py: 1.2,
                    minHeight: 44,
                    backgroundColor: active ? '#fbbf24' : 'transparent',
                    color: active ? '#000000' : '#94a3b8',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: active ? '#fbbf24' : 'rgba(255, 255, 255, 0.05)',
                      color: active ? '#000000' : '#ffffff',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? 0 : 32,
                      color: 'inherit',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      '& .MuiSvgIcon-root': { fontSize: '1.2rem' },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.825rem',
                        fontWeight: active ? 800 : 600,
                        noWrap: true,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Link>
          )
        })}
      </List>

      {/* Upgrade Card - Matches Image Exactly */}
      {!isCollapsed && (
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ mb: 1, color: '#fbbf24' }}>
              <StarIcon sx={{ fontSize: '1.5rem' }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#fff' }}>
              ₹80K / 40K Plan
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 2, color: '#64748b', fontSize: '0.7rem' }}
            >
              Advanced Premium System
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#fbbf24',
                color: '#000000',
                fontWeight: 900,
                borderRadius: '8px',
                py: 1,
                fontSize: '0.75rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#f59e0b', boxShadow: 'none' },
              }}
            >
              Upgrade Plan
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ p: 2, textAlign: 'center', mt: isCollapsed ? 'auto' : 0 }}>
        <Typography variant="caption" sx={{ color: '#334155', fontSize: '0.65rem' }}>
          {isCollapsed ? 'v1' : '© 2025 Taxi System. All rights reserved.'}
        </Typography>
      </Box>
    </Box>
  )
}
