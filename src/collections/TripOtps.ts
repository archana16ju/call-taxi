import type { CollectionConfig } from 'payload'

export const TripOtps: CollectionConfig = {
  slug: 'trip-otps',
  admin: {
    useAsTitle: 'otpMessageTemplate',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/OtpManagement#default',
        },
      },
    },
  },
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin' || role === 'driver'
  },

  create: ({ req }) => {
    return ['superadmin', 'admin'].includes(req.user?.role || '')
  },

  update: ({ req }) => {
    return ['superadmin', 'admin'].includes(req.user?.role || '')
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
  fields: [
    {
      name: 'otpLength',
      type: 'number',
      label: 'OTP Length',
      defaultValue: 6,
      required: true,
      admin: {
        description: 'Number of digits generated for ride OTP',
      },
    },

    {
      name: 'otpExpiryMinutes',
      type: 'number',
      label: 'OTP Expiry Time',
      defaultValue: 5,
      required: true,
      admin: {
        description: 'OTP validity duration in minutes',
      },
    },

    {
      name: 'enableSMS',
      type: 'checkbox',
      label: 'Enable SMS OTP',
      defaultValue: true,
    },

    {
      name: 'enableWhatsApp',
      type: 'checkbox',
      label: 'Enable WhatsApp OTP',
      defaultValue: true,
    },

    {
      name: 'enableEmail',
      type: 'checkbox',
      label: 'Enable Email OTP',
      defaultValue: false,
    },

    {
      name: 'smsProvider',
      type: 'select',
      label: 'SMS Provider',
      defaultValue: 'twilio',
      options: [
        {
          label: 'Twilio',
          value: 'twilio',
        },
        {
          label: 'MSG91',
          value: 'msg91',
        },
        {
          label: 'TextLocal',
          value: 'textlocal',
        },
      ],
    },

    {
      name: 'otpMessageTemplate',
      type: 'textarea',
      label: 'OTP Message Template',
      defaultValue:
        'Your ride OTP is {{otp}}. Share this code with driver to start your trip.',
      admin: {
        rows: 4,
      },
    },

    {
      name: 'maxRetryAttempts',
      type: 'number',
      label: 'Maximum Retry Attempts',
      defaultValue: 3,
      required: true,
    },

    {
      name: 'autoGenerateOnBookingConfirm',
      type: 'checkbox',
      label: 'Auto Generate OTP After Booking Confirmation',
      defaultValue: true,
    },

    {
      name: 'geoVerification',
      type: 'checkbox',
      label: 'Enable Pickup Location Verification',
      defaultValue: false,
    },

    {
      name: 'otpSecurityNote',
      type: 'textarea',
      label: 'Security Note',
      defaultValue:
        'OTP codes are single-use and valid for only 5 minutes.',
      admin: {
        rows: 3,
      },
    },
  ],
}