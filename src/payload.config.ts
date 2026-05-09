import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'

import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Drivers } from './collections/Drivers'
import { Tariffs } from './collections/Tariffs'
import { Vehicles, VehicleImages, VehicleIcons } from './collections/Vehicles'
import { Bookings } from './collections/Bookings'
import { Customers } from './collections/Customers'
import { Coupons } from './collections/Coupons'
import { SliderImages } from './collections/SliderImages'
import { Contacts } from './collections/Contacts'
import { Alerts } from './collections/Alerts'
import { Reviews } from './collections/Reviews'
import RevenueSettlement from './collections/revenue-settlements'
import PaymentMethods from './collections/paymentMethods'
import { Invoices } from './collections/Invoices'
import { TripOtps } from './collections/TripOtps'
import { TripSharing } from './collections/TripSharing'
import { DriverOfflineLogs } from './collections/DriverOfflineLogs'

// Globals
import { BookingReport } from './globals/BookingReport'
import { CustomerReport } from './globals/CustomerReport'
import { PaymentSettings } from './globals/PaymentSettings'
import { VehicleReport } from './globals/VehicleReport'
import { CancellationControl } from './globals/CancellationControl'
import { GeneralSettings } from './globals/GeneralSettings'

// Endpoints
import { getBookingReport } from './endpoints/getBookingReport'
import { getCustomerReport } from './endpoints/getCustomerReport'
import { DriverAllocation } from './collections/driver-allocation'
import RidePreferences from './collections/ridePreferences'

import MapComponent from './payload/admin/components/MapComponent'
import AiChatConversations from './collections/AiChatConversations'
import { VoiceBooking } from './collections/voicebooking'

// Paths
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)


export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,

  endpoints: [
    {
      path: '/get-booking-report',
      method: 'get',
      handler: getBookingReport,
    },
    {
      path: '/get-customer-report',
      method: 'get',
      handler: getCustomerReport,
    },
  ],

  admin: {
    user: Users.slug,

   

    meta: {
    titleSuffix: 'Taxi Admin',
  },

    // ✅ FIXED importMap resolution
  importMap: {
  baseDir: path.resolve(process.cwd(), 'src'),
},
    components: {
      graphics: {
        Logo: '@/payload/admin/components/Logo#Logo',
        Icon: '@/payload/admin/components/Logo#Logo',
      },

       Nav: '@/payload/admin/components/CustomNav#CustomNav',

      views: {
        login: {
          Component: '@/payload/admin/components/Logo#default',
        },
        dashboard: {
          Component: '@/payload/admin/components/MainDashboard#default',
        },
        'live-tracking': {
          Component: '@/payload/admin/components/MapComponent#LiveTrackingDashboard',
          path: '/live-tracking'
        },
        'driver-allocation': {
          Component: '@/payload/admin/components/DriverAllocationManagement#default',
          path: '/driver-allocation'
        },
        'voice-dispatch': {
          Component: '@/payload/admin/components/voicebooking#default',
          path: '/voice-dispatch'
        },
      },
    },
  },

  collections: [
    Users,
    Media,
    Drivers,
    Tariffs,
    Vehicles,
    VehicleImages,
    VehicleIcons,
    Bookings,
    Customers,
    Coupons,
    SliderImages,
    Contacts,
    Alerts,
    Reviews,
    RevenueSettlement,
    PaymentMethods,
    Invoices,
    TripOtps,
    TripSharing,
    DriverOfflineLogs,
    DriverAllocation,
    RidePreferences,
    AiChatConversations,
    VoiceBooking
  ],

  globals: [
    BookingReport,
    CustomerReport,
    PaymentSettings,
    VehicleReport,
    CancellationControl,
    GeneralSettings,
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types'),
  },

  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  sharp,

  plugins: [
    payloadCloudPlugin(),

    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: { prefix: 'Call Taxi/Kani Taxi' },
              'vehicle-images': { prefix: 'Call Taxi/Kani Taxi/Vehicles' },
              'vehicle-icons': { prefix: 'Call Taxi/Kani Taxi/Icons' },
              'slider-images': { prefix: 'Call Taxi/Kani Taxi/slider' },
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})