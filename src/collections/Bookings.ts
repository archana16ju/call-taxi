import type { CollectionConfig } from 'payload'
import { sendWhatsAppMessage } from '../utils/whatsapp'

export const Bookings: CollectionConfig = {
  slug: 'bookings',

  defaultSort: '-createdAt',
  admin: {
    group: 'Collection',
    defaultColumns: [
      'customerName',
      'customerPhone',
      'tripType',
      'pickupLocationName',
      'dropoffLocationName',
      'estimatedFare',
      'distanceKm',
      'pickupDateTime',
      'status',
      'paymentStatus',
      'paymentAmount',
    ],
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/booking#default',
        },
      },
    },
  },

  
  hooks: {
    
    beforeChange: [
      async ({ data, req, operation }) => {
        if ((operation === 'create' || operation === 'update') && data.customerPhone) {
          const existingCustomer = await req.payload.find({
            collection: 'customers',
            where: {
              phone: {
                equals: data.customerPhone,
              },
            },
            limit: 1,
            depth: 0,
          })

          if (existingCustomer.docs.length > 0) {
            data.customer = existingCustomer.docs[0].id
          } else {
            const newCustomer = await req.payload.create({
              collection: 'customers',
              data: {
                name: data.customerName || 'Unknown',
                phone: data.customerPhone,
              },
            })
            data.customer = newCustomer.id
          }
        }
        if (operation === 'create' && !data.bookingCode) {
          let code = ''
          let isUnique = false
          while (!isUnique) {
            code = Math.floor(100000 + Math.random() * 900000).toString()
            const existing = await req.payload.find({
              collection: 'bookings',
              where: {
                bookingCode: {
                  equals: code,
                },
              },
              limit: 0,
            })
            if (existing.docs.length === 0) {
              isUnique = true
            }
          }
          data.bookingCode = code
        }
        // AUTO APPLY RIDE PREFERENCES INTO BOOKING
if (operation === 'create' && data.customer) {
  const prefs = await req.payload.find({
    collection: 'ride-preferences',
    where: {
      user: {
        equals: data.customer,
      },
    },
    limit: 1,
  })

  if (prefs.docs.length > 0) {
    const userPref = prefs.docs[0]

    if (userPref.autoApplyToBooking) {
      data.appliedPreferences = userPref.id

      // optional: snapshot important fields directly into booking
      data.childSeat = userPref.preferences?.childSeat
      data.petFriendly = userPref.preferences?.petFriendly
      data.acLevel = userPref.comfort?.acLevel
      data.music = userPref.comfort?.music
    }
  }
}
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const newDriverId = typeof doc.driver === 'object' ? doc.driver?.id : doc.driver
        const oldDriverId = previousDoc
          ? typeof previousDoc.driver === 'object'
            ? previousDoc.driver?.id
            : previousDoc.driver
          : null
        const newVehicleId = typeof doc.vehicle === 'object' ? doc.vehicle?.id : doc.vehicle
        const oldVehicleId = previousDoc
          ? typeof previousDoc.vehicle === 'object'
            ? previousDoc.vehicle?.id
            : previousDoc.vehicle
          : null

        // If a new driver is assigned or the driver has changed
        if (newDriverId && newDriverId !== oldDriverId) {
          await req.payload.update({
            collection: 'drivers',
            id: newDriverId,
            data: {
              status: 'onduty',
            } as any,
          })
        }

        // If the old driver was replaced or unassigned, set them back to available
        if (oldDriverId && oldDriverId !== newDriverId) {
          await req.payload.update({
            collection: 'drivers',
            id: oldDriverId,
            data: {
              status: 'available',
            } as any,
          })
        }

        // If a new vehicle is assigned or the vehicle has changed
        if (newVehicleId && newVehicleId !== oldVehicleId) {
          await req.payload.update({
            collection: 'vehicles',
            id: newVehicleId,
            data: {
              status: 'driving',
            } as any,
          })
        }

        // If the old vehicle was replaced or unassigned, set it back to available
        if (oldVehicleId && oldVehicleId !== newVehicleId) {
          await req.payload.update({
            collection: 'vehicles',
            id: oldVehicleId,
            data: {
              status: 'available',
            } as any,
          })
        }

        // Update status if booking becomes confirmed
        if (doc.status === 'confirmed' && previousDoc?.status !== 'confirmed') {
          if (newDriverId) {
            await req.payload.update({
              collection: 'drivers',
              id: newDriverId,
              data: { status: 'onduty' } as any,
            })
          }
          if (newVehicleId) {
            await req.payload.update({
              collection: 'vehicles',
              id: newVehicleId,
              data: { status: 'driving' } as any,
            })
          }
        }

        // Release driver if booking is completed or cancelled
        if ((doc.status === 'completed' || doc.status === 'cancelled') && newDriverId) {
          await req.payload.update({
            collection: 'drivers',
            id: newDriverId,
            data: {
              status: 'available',
            } as any,
          })
        }

        // Release vehicle if booking is completed or cancelled
        if ((doc.status === 'completed' || doc.status === 'cancelled') && newVehicleId) {
          await req.payload.update({
            collection: 'vehicles',
            id: newVehicleId,
            data: {
              status: 'available',
            } as any,
          })
        }

        // --- AUTOMATIC INVOICE GENERATION ---
        if (doc.status === 'completed' && previousDoc?.status !== 'completed') {
           await req.payload.create({
             collection: 'invoices',
             data: {
               booking: doc.id,
               customer: doc.customer,
               driver: doc.driver,
               date: new Date(),
               baseFare: doc.estimatedFare || 0,
               pickupLocation: doc.pickupLocationName,
               dropoffLocation: doc.dropoffLocationName,
               distance: doc.distanceKm,
               status: 'pending',
             } as any
           })
        }

        // --- AUTOMATIC ALERTS ---
        
        // 1. New Booking Alert
        if (operation === 'create') {
          await req.payload.create({
            collection: 'alerts',
            data: {
              title: 'New Booking Request',
              message: `New booking #${doc.bookingCode} from ${doc.customerName}`,
              type: 'info',
              isRead: false,
            },
          })
        }

        // 2. Booking Confirmed Alert
        if (operation === 'update' && doc.status === 'confirmed' && previousDoc?.status !== 'confirmed') {
          await req.payload.create({
            collection: 'alerts',
            data: {
              title: 'Booking Confirmed',
              message: `Booking #${doc.bookingCode} has been confirmed.`,
              type: 'info',
              isRead: false,
            },
          })
        }

        // 3. Payment Failed Alert
        if (doc.paymentStatus === 'failed' && previousDoc?.paymentStatus !== 'failed') {
          await req.payload.create({
            collection: 'alerts',
            data: {
              title: 'Payment Failed',
              message: `Payment failed for booking #${doc.bookingCode}`,
              type: 'payment_fail',
              isRead: false,
            },
          })
        }

        // 4. Payment Success Alert
        if (doc.paymentStatus === 'paid' && previousDoc?.paymentStatus !== 'paid') {
          await req.payload.create({
            collection: 'alerts',
            data: {
              title: 'Payment Success',
              message: `Payment received for booking #${doc.bookingCode}`,
              type: 'info',
              isRead: false,
            },
          })
        }

        //--- AUTO RE-ALLOCATION LOGIC ---
        // If a driver was assigned but is now unassigned (cancellation)

        if (operation === 'update' && oldDriverId && !newDriverId && doc.status === 'confirmed') {
          // Find next best driver
          const availableDrivers = await req.payload.find({
            collection: 'drivers',
            where: {
              status: { equals: 'available' },
            },
            limit: 10,
          })

          if (availableDrivers.docs.length > 0) {
            // Simply pick the first available one for now (could be distance based)
            const nextDriver = availableDrivers.docs[0]
            
            await req.payload.update({
              collection: 'bookings',
              id: doc.id,
              data: {
                driver: nextDriver.id,
                reallocationHistory: [
                  ...(doc.reallocationHistory || []),
                  {
                    previousDriver: oldDriverId,
                    timestamp: new Date().toISOString(),
                    reason: 'Driver cancelled / unassigned',
                  },
                ],
              } as any,
            })

            await req.payload.create({
              collection: 'alerts',
              data: {
                title: 'Auto Re-allocation',
                message: `Booking #${doc.bookingCode} re-allocated to ${nextDriver.name} after cancellation.`,
                type: 'info',
                isRead: false,
              },
            })
          }
        }

        // 5. SOS / Emergency Alert
        if (doc.sosTriggered === true && previousDoc?.sosTriggered !== true) {
          await req.payload.create({
            collection: 'alerts',
            data: {
              title: '🆘 EMERGENCY / SOS',
              message: `SOS triggered for booking #${doc.bookingCode} by ${doc.customerName}`,
              type: 'emergency',
              isRead: false,
            },
          })
        }

        //--- AUTOMATIC OTP GENERATION ON CONFIRMATION ---
        if (doc.status === 'confirmed' && previousDoc?.status !== 'confirmed') {
          const otp = Math.floor(100000 + Math.random() * 900000).toString()
          const expiry = new Date()
          expiry.setMinutes(expiry.getMinutes() + 10) // 10 minutes expiry

          await (req.payload.create as any)({
            collection: 'trip-otps',
            data: {
              booking: doc.id,
              otp: otp,
              expiresAt: expiry,
              deliveryMethod: 'sms',
              deliveryStatus: 'sent',
            },
          })

          // Create an alert for the OTP
          await req.payload.create({
            collection: 'alerts',
            data: {
              title: 'OTP Generated',
              message: `OTP for booking #${doc.bookingCode} is ${otp}. Sent to ${doc.customerPhone}`,
              type: 'info',
              isRead: false,
            },
          })
        }
          
        // --- AUTOMATIC SHARING LINK ON TRIP START ---
        if (doc.tripStatus === 'started' && previousDoc?.tripStatus !== 'started') {
          const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
          const expiry = new Date()
          expiry.setHours(expiry.getHours() + 24) // 24 hours sharing

          await (req.payload.create as any)({
            collection: 'trip-sharing',
            data: {
              booking: doc.id,
              shareToken: shareToken,
              expiresAt: expiry,
              active: true,
            },
          })

          // Update booking with sharing token
          await (req.payload.update as any)({
            collection: 'bookings',
            id: doc.id,
            data: {
              sharingToken: shareToken,
            },
          })

          await req.payload.create({
            collection: 'alerts',
            data: {
              title: 'Trip Started & Shared',
              message: `Trip for booking #${doc.bookingCode} has started. Live sharing active.`,
              type: 'info',
              isRead: false,
            },
          })

          // --- SEND WHATSAPP NOTIFICATION ---
          const publicLink = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || ''}/live-tracking?token=${shareToken}`
          await sendWhatsAppMessage(
            req.payload,
            doc.customerPhone,
            doc.customerName,
            publicLink
          )
        }
      },
    ],
  },
  fields: [
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerPhone', type: 'text', required: true },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    { name: 'vehicle', type: 'relationship', relationTo: 'vehicles', required: true },
    {
      name: 'tripType',
      type: 'select',
      options: ['oneway', 'roundtrip', 'packages', 'multilocation'],
      required: true,
    },
     {
      name: "appliedPreferences",
      type: "relationship",
      relationTo: "ride-preferences",
    },
    {
      name: 'driver',
      type: 'relationship',
      relationTo: 'drivers',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },

    { name: 'pickupLocation', type: 'point', required: true },
    { name: 'pickupLocationName', type: 'text', required: true },

    { name: 'dropoffLocation', type: 'point', required: false },
    { name: 'dropoffLocationName', type: 'text', required: false },

    // Tour Locations
    {
      name: 'tourLocations',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'point', type: 'point', required: true },
      ],
      admin: {
        condition: (data) => data.tripType === 'multilocation',
      },
    },

    {
      name: 'pickupDateTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'dropDateTime',
      type: 'date',
      required: false,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    { name: 'estimatedFare', type: 'number', required: false },
    { name: 'couponCode', type: 'text', required: false },
    { name: 'discountAmount', type: 'number', required: false },
    { name: 'distanceKm', type: 'number', required: false },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'confirmed', 'cancelled', 'completed'],
      defaultValue: 'pending',
    },
    {
      name: 'tripStatus',
      type: 'select',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress / Started', value: 'started' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'not_started',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'otpVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sharingToken',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: ['unpaid', 'partial', 'paid', 'failed'],
      defaultValue: 'unpaid',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentAmount',
      type: 'number',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sosTriggered',
      type: 'checkbox',
      label: '🚨 Trigger SOS / Emergency',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentType',
      type: 'select',
      options: ['minimum', 'full'],
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'razorpaySignature',
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'bookingCode',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'reallocationHistory',
      type: 'array',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      fields: [
        { name: 'previousDriver', type: 'relationship', relationTo: 'drivers' },
        { name: 'timestamp', type: 'date' },
        { name: 'reason', type: 'text' },
      ],
    },
  ],
  access: { create: () => true, read: () => true, update: () => true, delete: () => true },
}
