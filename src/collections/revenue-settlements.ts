import { CollectionConfig } from 'payload'

const RevenueSettlement: CollectionConfig = {
  slug: 'revenue-settlements',

  admin: {
    group: 'Collection',
    useAsTitle: 'tripId',
    components: {
      views: {
        list: {
          Component: '@/app/(payload)/components/revenuesettlement#default',
        },
      },
    },
  },
  fields: [
    {
      name: 'tripId',
      type: 'text',
      required: true,
    },
    {
      name: 'driverName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'distanceKm',
      type: 'number',
      required: true,
    },
    {
      name: 'timeMinutes',
      type: 'number',
      required: true,
    },
    {
      name: 'baseFare',
      type: 'number',
      required: true,
    },
    {
      name: 'distanceFare',
      type: 'number',
    },
    {
      name: 'timeFare',
      type: 'number',
    },
    {
      name: 'totalFare',
      type: 'number',
      required: true,
    },
    {
      name: 'commission',
      type: 'number',
      required: true,
    },
    {
      name: 'driverEarnings',
      type: 'number',
      required: true,
    },
    {
      name: 'platformRevenue',
      type: 'number',
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'UPI', value: 'upi' },
        { label: 'Card', value: 'card' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Settled', value: 'settled' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'walletBalance',
      type: 'number',
    },
    {
      name: 'payoutAmount',
      type: 'number',
    },
    {
      name: 'settlementDate',
      type: 'date',
    },
    {
      name: 'createdAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}

export default RevenueSettlement
