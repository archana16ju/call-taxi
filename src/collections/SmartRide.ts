// src/collections/SmartRide.ts

import type { CollectionConfig } from 'payload'

export const SmartRide: CollectionConfig = {
  slug: 'smart-ride',

  admin: {
    useAsTitle: 'userName',
  },

  fields: [
    {
      name: 'userName',
      type: 'text',
      required: true,
    },

    {
      name: 'email',
      type: 'email',
    },

    {
      name: 'phone',
      type: 'text',
    },

    // ---------------------------
    // QUICK PRESETS
    // ---------------------------
    {
      name: 'quickPresets',
      type: 'array',
      label: 'Quick Presets',
      fields: [
        {
          name: 'presetName',
          type: 'text',
          required: true,
        },

        {
          name: 'description',
          type: 'textarea',
        },

        {
          name: 'active',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    // ---------------------------
    // RIDE REQUIREMENTS
    // ---------------------------
    {
      name: 'rideRequirements',
      type: 'group',
      fields: [
        {
          name: 'childSeat',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'petFriendly',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'luggageSupport',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'wheelchairAccess',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    // ---------------------------
    // COMFORT SETTINGS
    // ---------------------------
    {
      name: 'comfortSettings',
      type: 'group',
      fields: [
        {
          name: 'acLevel',
          type: 'select',
          options: [
            {
              label: 'Low',
              value: 'low',
            },
            {
              label: 'Medium',
              value: 'medium',
            },
            {
              label: 'High',
              value: 'high',
            },
          ],
          defaultValue: 'medium',
        },

        {
          name: 'rideMode',
          type: 'select',
          options: [
            {
              label: 'Office',
              value: 'office',
            },
            {
              label: 'Relax',
              value: 'relax',
            },
            {
              label: 'Night',
              value: 'night',
            },
          ],
          defaultValue: 'office',
        },

        {
          name: 'musicPreference',
          type: 'select',
          options: [
            {
              label: 'Classical Focus',
              value: 'classical-focus',
            },
            {
              label: 'Soft Music',
              value: 'soft-music',
            },
            {
              label: 'No Music',
              value: 'no-music',
            },
          ],
        },
      ],
    },

    // ---------------------------
    // SMART AUTOMATION
    // ---------------------------
    {
      name: 'smartAutomation',
      type: 'group',
      fields: [
        {
          name: 'autoApply',
          type: 'checkbox',
          defaultValue: true,
        },

        {
          name: 'shareWithDriver',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],

  timestamps: true,
}