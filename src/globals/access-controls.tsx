'use client'

import React from 'react'

/* ================= ICONS ================= */
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
import SettingsIcon from '@mui/icons-material/Settings'

/* ================= ROLES ================= */
export type Role = 'superadmin' | 'admin' | 'accounts' | 'driver'

/* ================= MENU TYPE ================= */
export type MenuItem = {
  label: string
  path?: string
  icon?: React.ReactNode
  type?: 'header'
  roles?: Role[]
}

/* ================= MENU CONFIG ================= */
export const menuItems: MenuItem[] = [
  /* ========== DASHBOARD ========== */
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/admin',
    roles: ['superadmin', 'admin', 'accounts', 'driver'],
  },

  { type: 'header', label: 'MANAGEMENT' },

  {
    label: 'Users & Roles',
    icon: <AdminPanelSettingsIcon />,
    path: '/admin/collections/users',
    roles: ['superadmin'],
  },
  {
    label: 'Drivers',
    icon: <PeopleIcon />,
    path: '/admin/collections/drivers',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Customers',
    icon: <PeopleIcon />,
    path: '/admin/collections/customers',
    roles: ['superadmin', 'admin', 'accounts'],
  },
  {
    label: 'Sliders',
    icon: <CollectionsIcon />,
    path: '/admin/collections/slider-images',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Media Gallery',
    icon: <CollectionsIcon />,
    path: '/admin/collections/media',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Vehicles',
    icon: <LocalTaxiIcon />,
    path: '/admin/collections/vehicles',
    roles: ['superadmin', 'admin'],
  },

  { type: 'header', label: 'SMART BOOKING' },

  {
    label: 'Bookings',
    icon: <BookIcon />,
    path: '/admin/collections/bookings',
    roles: ['superadmin', 'admin', 'accounts'],
  },
  {
    label: 'Driver Allocation',
    icon: <HubIcon />,
    path: '/admin/driver-allocation',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Voice Dispatch',
    icon: <MicIcon />,
    path: '/admin/voice-dispatch',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Smart Ride',
    icon: <AutoAwesomeIcon />,
    path: '/admin/collections/ride-preferences',
    roles: ['superadmin', 'admin', 'accounts'],
  },

  { type: 'header', label: 'LIVE TRACKING SYSTEM' },

  {
    label: 'Live GPS Tracking',
    icon: <GpsFixedIcon />,
    path: '/live-tracking',
    roles: ['superadmin', 'admin', 'driver'],
  },
  {
    label: 'Offline Sync Logs',
    icon: <HistoryIcon />,
    path: '/admin/collections/driver-offline-logs',
    roles: ['superadmin', 'admin'],
  },

  { type: 'header', label: 'SMART COMMUNICATION' },

  {
    label: 'Support (WhatsApp)',
    icon: <WhatsAppIcon />,
    path: '/admin/globals/general-settings',
    roles: ['superadmin', 'admin', 'accounts'],
  },
  {
    label: 'AI Chat Support',
    icon: <WhatsAppIcon />,
    path: '/admin/collections/ai-chat-conversations',
    roles: ['superadmin', 'admin'],
  },

  { type: 'header', label: 'SECURITY SYSTEM' },

  {
    label: 'Cancellation Control',
    icon: <CancelIcon />,
    path: '/admin/globals/cancellation-control',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Trip OTPs',
    icon: <SecurityIcon />,
    path: '/admin/collections/trip-otps',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Trip Sharing',
    icon: <ShareIcon />,
    path: '/admin/collections/trip-sharing',
    roles: ['superadmin', 'admin'],
  },

  { type: 'header', label: 'FINANCIAL SETTLEMENTS' },

  {
    label: 'Revenue & Settlements',
    icon: <AccountBalanceWalletIcon />,
    path: '/admin/collections/revenue-settlements',
    roles: ['superadmin', 'admin', 'accounts'],
  },

  { type: 'header', label: 'ACCOUNTS' },

  {
    label: 'Invoices',
    icon: <ReceiptIcon />,
    path: '/admin/collections/invoices',
    roles: ['superadmin', 'accounts'],
  },
  {
    label: 'Payment Settings',
    icon: <PaymentsIcon />,
    path: '/admin/globals/payment-settings',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Payment Methods',
    icon: <PaymentsIcon />,
    path: '/admin/collections/payment-methods',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Tariffs',
    icon: <MonetizationOnIcon />,
    path: '/admin/collections/tariffs',
    roles: ['superadmin', 'admin', 'accounts'],
  },
  {
    label: 'Coupons & Discounts',
    icon: <LocalActivityIcon />,
    path: '/admin/collections/coupons',
    roles: ['superadmin', 'admin'],
  },

  { type: 'header', label: 'NOTIFICATIONS' },

  {
    label: 'Alerts Center',
    icon: <NotificationsIcon />,
    path: '/admin/collections/alerts',
    roles: ['superadmin', 'admin'],
  },
  {
    label: 'Contact Inquiries',
    icon: <ContactMailIcon />,
    path: '/admin/collections/contacts',
    roles: ['superadmin', 'admin', 'accounts'],
  },

  { type: 'header', label: 'REPORTS' },

  {
    label: 'Customer Reports',
    icon: <AssessmentIcon />,
    path: '/admin/globals/customer-report',
    roles: ['superadmin', 'admin', 'accounts'],
  },
  {
    label: 'Booking Reports',
    icon: <AssessmentIcon />,
    path: '/admin/globals/booking-report',
    roles: ['superadmin', 'admin', 'accounts'],
  },
  {
    label: 'Vehicle Reports',
    icon: <AssessmentIcon />,
    path: '/admin/globals/vehicle-report',
    roles: ['superadmin', 'admin'],
  },

  { type: 'header', label: 'FEEDBACKS' },

  {
    label: 'Ratings & Reviews',
    icon: <StarRateIcon />,
    path: '/admin/collections/reviews',
    roles: ['superadmin', 'admin', 'accounts'],
  },

  { type: 'header', label: 'SETTINGS' },

  {
    label: 'System Settings',
    icon: <SettingsIcon />,
    path: '/admin/collections/settings',
    roles: ['superadmin', 'admin'],
  },
]

/* ================= FILTER FUNCTION ================= */
export const getFilteredMenu = (role?: Role) => {
  if (!role) return []

  return menuItems.filter((item) => {
    if (item.type === 'header') return true
    return item.roles?.includes(role)
  })
}