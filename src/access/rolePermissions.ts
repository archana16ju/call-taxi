type RolePermissionType = {
  active: boolean
  permissions: string[]
}

export const ROLE_PERMISSIONS: Record<string, RolePermissionType> = {
  superadmin: {
    active: true,
    permissions: ['*'],
  },

  admin: {
    active: true,
    permissions: [
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
    '/admin/collections/alerts',
    '/admin/collections/contacts',
    '/admin/globals/customer-report',
    '/admin/globals/booking-report',
    '/admin/globals/vehicle-report',
    '/admin/collections/reviews',
  ],
},

 accounts: {
    active: true,
    permissions: [
    '/admin',
    '/admin/collections/invoices',
    '/admin/globals/payment-settings',
    '/admin/collections/payment-methods',
    '/admin/collections/tariffs',
    '/admin/collections/coupons',
    '/admin/collections/alerts',
  ],
},
}