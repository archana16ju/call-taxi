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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ReceiptIcon from '@mui/icons-material/Receipt'
import SecurityIcon from '@mui/icons-material/Security'
import ShareIcon from '@mui/icons-material/Share'
import HistoryIcon from '@mui/icons-material/History'
import HubIcon from '@mui/icons-material/Hub'

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
  { label: 'Smart Ride', icon: <HubIcon />, path: '/admin/collections/smart-rides' },
  { type: 'header', label: 'LIVE TRACKING SYSTEM' },
  { label: 'Live GPS Tracking', icon: <GpsFixedIcon />, path: '/admin/live-tracking' },
  { label: 'Offline Sync Logs', icon: <HistoryIcon />, path: '/admin/collections/driver-offline-logs' },
  { type: 'header', label: 'SMART COMMUNICATION' },
  { label: 'Support (WhatsApp)', icon: <WhatsAppIcon />, path: '/admin/globals/general-settings' },
  { type: 'header', label: 'SECURITY SYSTEM' },
  { label: 'Cancellation Control',icon: <CancelIcon />,path: '/admin/globals/cancellation-control',},
  { label: 'Trip OTPs', icon: <SecurityIcon />, path: '/admin/collections/trip-otps' },
  { label: 'Trip Sharing', icon: <ShareIcon />, path: '/admin/collections/trip-sharing' },
  { type: 'header', label: 'FINANCIAL SETTLEMENTS' },
  { label: 'Revenue & Settlements',icon: <AccountBalanceWalletIcon />,path: '/admin/collections/revenue-settlements' },
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

  return (
    <Box
      sx={{
        width: 260,
        height: '100%',
        backgroundColor: '#1e293b',
        color: '#ffffff',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: '#fbbf24',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LocalTaxiIcon sx={{ color: '#000000' }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1 }}>
            Taxi Service
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>
            Advanced Premium
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, pb: 4 }}>
        {menuItems.map((item, index) => {
          if (item.type === 'header') {
            return (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 3,
                  mb: 1,
                  px: 2,
                  color: 'var(--theme-text-secondary)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
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
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: active ? '#fbbf24' : 'transparent',
                    color: active ? '#000000' : 'var(--theme-text)',
                    '&:hover': {
                      backgroundColor: active ? '#fbbf24' : 'var(--theme-elevation-100)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: active ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          )
        })}
      </List>

      {/* Upgrade Card */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            backgroundColor: 'var(--theme-bg-card)',
            textAlign: 'center',
            border: '1px solid var(--theme-border-color)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--theme-text)' }}>
            Subscription Plans
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: 'block', mb: 2, color: 'var(--theme-text-secondary)' }}
          >
            Unlock Powerful Features
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#fbbf24',
              color: '#000000',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#f59e0b' },
            }}
          >
            Upgrade Plan
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'var(--theme-text-secondary)' }}>
          © 2026 Taxi Services
        </Typography>
      </Box>
    </Box>
  )
}
