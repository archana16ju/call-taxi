// src/access/rbac.config.ts

export type Role = 'superadmin' | 'admin' | 'accounts' | 'driver'

export type Action = 'create' | 'read' | 'update' | 'delete'

export type Resource =
  | 'AiChatConversations'
  | 'Alerts'
  | 'Bookings'
  | 'Contacts'
  | 'Coupons'
  | 'Customers'
  | 'driver-allocation'
  | 'DriverOfflineLogs'
  | 'Drivers'
  | 'Invoices'
  | 'Media'
  | 'paymentMethods'
  | 'revenue-settlements'
  | 'Reviews'
  | 'ridePreferences'
  | 'SliderImages'
  | 'Tariffs'
  | 'TripOtps'
  | 'TripSharing'
  | 'Users'
  | 'Vehicles'
  | 'voicebooking'
  | 'BookingReport'
  | 'CancellationControl'
  | 'CustomerReport'
  | 'GeneralSettings'
  | 'PaymentSettings'
  | 'VehicleReport'

/**
 * CENTRAL PERMISSION MATRIX
 */
export const permissions: Record<Role, Record<string, Action[] | '*'>> = {
  superadmin: {
    '*': '*', // full access everywhere
  },

  admin: {
    Users: ['read', 'update'],
    Drivers: ['create', 'read', 'update'],
    Bookings: ['create', 'read', 'update', 'delete'],
    Customers: ['read', 'update'],
    Vehicles: ['create', 'read', 'update'],
    Tariffs: ['create', 'read', 'update'],
    Coupons: ['create', 'read', 'update'],
    Alerts: ['create', 'read', 'update'],
    Reviews: ['read', 'update'],
    Invoices: ['read', 'update'],
    'driver-allocation': ['create', 'read', 'update'],
    Media: ['create', 'read', 'delete'],
    voicebooking: ['read', 'update'],
    Contacts: ['read', 'delete'],

    BookingReport: ['read'],
    VehicleReport: ['read'],
    CustomerReport: ['read'],
  },

  accounts: {
    Invoices: ['create', 'read', 'update'],
    paymentMethods: ['create', 'read', 'update'],
    'revenue-settlements': ['create', 'read', 'update'],
    Customers: ['read'],
    Bookings: ['read'],
    Drivers: ['read'],

    PaymentSettings: ['read', 'update'],
    BookingReport: ['read'],
  },

  driver: {
    Bookings: ['read'],
    'driver-allocation': ['read'],
    DriverOfflineLogs: ['create', 'read'],
    Vehicles: ['read'],
    ridePreferences: ['create', 'read', 'update'],
    voicebooking: ['create', 'read'],
  },
}

/**
 * CHECK PERMISSION
 */
export function can(role: Role, resource: Resource, action: Action): boolean {
  const rolePermissions = permissions[role]

  if (!rolePermissions) return false

  // superadmin wildcard
  if (rolePermissions['*'] === '*') return true

  const allowed = rolePermissions[resource]
  if (!allowed) return false

  return allowed === '*' || (allowed as Action[]).includes(action)
}