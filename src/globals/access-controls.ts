export type Role = 'superadmin' | 'admin' | 'accounts' | 'driver'

type MenuItem = {
  label: string
  path?: string
  type?: 'header'
  roles?: Role[]
}

export const accessControls = {
  menu: [
    { label: 'Dashboard', path: '/admin', roles: ['superadmin', 'admin', 'accounts', 'driver'] },

    { type: 'header', label: 'MANAGEMENT' },
    { label: 'Users & Roles', path: '/admin/collections/users', roles: ['superadmin'] },
    { label: 'Drivers', path: '/admin/collections/drivers', roles: ['superadmin', 'admin'] },
    { label: 'Customers', path: '/admin/collections/customers', roles: ['superadmin', 'admin', 'accounts'] },

    { type: 'header', label: 'BOOKINGS' },
    { label: 'Bookings', path: '/admin/collections/bookings', roles: ['superadmin', 'admin', 'accounts'] },
    { label: 'Driver Allocation', path: '/admin/driver-allocation', roles: ['superadmin', 'admin'] },

    { type: 'header', label: 'LIVE' },
    { label: 'Live GPS', path: '/live-tracking', roles: ['superadmin', 'admin', 'driver'] },

    { type: 'header', label: 'FINANCE' },
    { label: 'Invoices', path: '/admin/collections/invoices', roles: ['superadmin', 'admin', 'accounts'] },
    { label: 'Tariffs', path: '/admin/collections/tariffs', roles: ['superadmin', 'admin'] },

    { type: 'header', label: 'REPORTS' },
    { label: 'Reports', path: '/admin/reports', roles: ['superadmin', 'admin', 'accounts'] },

    { type: 'header', label: 'SYSTEM' },
    { label: 'Settings', path: '/admin/settings', roles: ['superadmin', 'admin'] },
  ] as MenuItem[],
}
export const getFilteredMenu = (role?: Role) => {
  if (!role) return []

  return accessControls.menu.filter((item) => {
    if (item.type === 'header') return true
    return item.roles?.includes(role)
  })
}