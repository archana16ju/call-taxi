const fs = require('fs')

const collections = [
  'AiChatConversations',
  'Alerts',
  'Bookings',
  'Contacts',
  'Coupons',
  'Customers',
  'driver-allocation',
  'DriverOfflineLogs',
  'Drivers',
  'Invoices',
  'Media',
  'paymentMethods',
  'revenue-settlements',
  'Reviews',
  'ridePreferences',
  'SliderImages',
  'Tariffs',
  'TripOtps',
  'TripSharing',
  'Users',
  'Vehicles',
  'voicebooking',
]

const outputDir = './src/collections/access'

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

collections.forEach((name) => {
  const fileName = `${outputDir}/${name}.access.ts`

  const content = `
import { can } from '@/access/rbac.config'

export const ${name.replace(/-/g, '')}Access = {
  create: ({ req }) => can(req.user.role, '${name}', 'create'),
  read: ({ req }) => can(req.user.role, '${name}', 'read'),
  update: ({ req }) => can(req.user.role, '${name}', 'update'),
  delete: ({ req }) => can(req.user.role, '${name}', 'delete'),
}
`

  fs.writeFileSync(fileName, content.trim())
})

console.log('✅ Access files generated successfully!')