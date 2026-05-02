import { CollectionConfig } from "payload";

const RidePreferences: CollectionConfig = {
  slug: "ride-preferences",
  admin: {
    useAsTitle: "user",
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/RidePreferences#default',
        },
      },
    },
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },

    // Core Preferences
    {
      name: "preferences",
      type: "group",
      fields: [
        {
          name: "childSeat",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "extraLuggage",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "petFriendly",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "wheelchairAccess",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },

    // Comfort Settings
    {
      name: "comfort",
      type: "group",
      fields: [
        {
          name: "acLevel",
          type: "select",
          options: [
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ],
          defaultValue: "medium",
        },
        {
          name: "music",
          type: "select",
          options: [
            { label: "Off", value: "off" },
            { label: "Soft", value: "soft" },
            { label: "Loud", value: "loud" },
          ],
          defaultValue: "soft",
        },
      ],
    },

    // Ride Presets
    {
      name: "ridePresets",
      type: "array",
      fields: [
        {
          name: "presetName",
          type: "text",
          required: true,
        },
        {
          name: "acLevel",
          type: "select",
          options: ["low", "medium", "high"],
        },
        {
          name: "music",
          type: "select",
          options: ["off", "soft", "loud"],
        },
        {
          name: "notes",
          type: "textarea",
        },
      ],
    },

    // Quick Rebooking
    {
      name: "lastBooking",
      type: "relationship",
      relationTo: "bookings",
    },

    {
      name: "favoriteLocations",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
        },
        {
          name: "address",
          type: "text",
        },
      ],
    },

    //Auto Sync with Booking
    {
      name: "autoApplyToBooking",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};

export default RidePreferences;