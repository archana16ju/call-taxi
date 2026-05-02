import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'customer', 'date', 'totalAmount', 'status'],
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/InvoiceManagement#default',
        },
        edit: {
          default: {
            Component: '@/payload/admin/components/InvoiceCreate#InvoiceForm',
          },
        },
      },
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-generate Invoice Number if creating
        if (operation === 'create' && !data.invoiceNumber) {
          const count = await req.payload.count({ collection: 'invoices' })
          data.invoiceNumber = `INV-${new Date().getFullYear()}-${(count.totalDocs + 1).toString().padStart(3, '0')}`
        }

        // Calculate Total Amount
        const baseFare = data.baseFare || 0
        const taxRate = 0.05 // 5% tax as seen in UI image
        data.tax = baseFare * taxRate
        data.totalAmount = baseFare + data.tax

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
       // If payment status changed to 'paid'
        if (doc.status === 'paid' && previousDoc?.status !== 'paid') {
          // Update Booking Status
          if (doc.booking) {
            await req.payload.update({
              collection: 'bookings',
              id: typeof doc.booking === 'object' ? doc.booking.id : doc.booking,
              data: {
                paymentStatus: 'paid',
              },
            })
          }
          
          // Generate Receipt Number
          if (!doc.receiptNumber) {
             const timestamp = new Date().getTime().toString().slice(-6)
             await req.payload.update({
               collection: 'invoices',
               id: doc.id,
               data: {
                 receiptNumber: `RCPT-${new Date().getFullYear()}-${timestamp}`
               }
             })
          }

          // TODO: Send Email & Generate PDF logic would go here
        }
      }
    ]
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'driver',
      type: 'relationship',
      relationTo: 'drivers',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'baseFare',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'tax',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paymentMethod',
      type: 'relationship',
      relationTo: 'payment-methods',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'pickupLocation',
      type: 'text',
    },
    {
      name: 'dropoffLocation',
      type: 'text',
    },
    {
      name: 'distance',
      type: 'number',
    },
    {
      name: 'receiptNumber',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
}
