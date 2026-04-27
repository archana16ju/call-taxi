import { GlobalConfig } from 'payload'

export const CancellationControl: GlobalConfig = {
  slug: 'cancellation-control',
  admin: {
    group: 'Management',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'penaltyAmount',
      type: 'number',
      label: 'Penalty Amount (₹)',
      required: true,
      defaultValue: 50,
    },
    {
      name: 'rules',
      type: 'textarea',
      label: 'Cancellation Rules',
      required: true,
      defaultValue: '1. Free cancellation within 5 minutes of booking.\n2. Cancellation after 5 minutes incurs a penalty.\n3. Driver cancellation after arriving at pickup point incurs a penalty.',
    },
    {
      name: 'allowGracePeriod',
      type: 'checkbox',
      label: 'Allow Grace Period (5 mins)',
      defaultValue: true,
    },
    {
      name: 'trackingEnabled',
      type: 'checkbox',
      label: 'Track All Cancellations',
      defaultValue: true,
    },
  ],
}
