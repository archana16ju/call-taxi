import { CollectionConfig } from "payload";

const PaymentMethods: CollectionConfig = {
  slug: "payment-methods",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "type", "isActive", "updatedAt"],
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/PaymentMethodManagement#default',
        },
        edit: {
          default: {
            Component: '@/payload/admin/components/PaymentMethodCreate#PaymentMethodForm',
          },
        },
      },
    },
  },
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin' || role === 'accounts'
  },

  create: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin'
  },

  update: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin'
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
  fields: [
    {
      name: "name",
      label: "Payment Method Name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      label: "Payment Type",
      type: "select",
      required: true,
      options: [
        { label: "Cash", value: "cash" },
        { label: "UPI", value: "upi" },
        { label: "Credit/Debit Card", value: "card" },
        { label: "Net Banking", value: "netbanking" },
        { label: "Wallet", value: "wallet" },
      ],
    },
    {
      name: "isActive",
      label: "Enable Method",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "processingFee",
      label: "Processing Fee (%)",
      type: "number",
      min: 0,
      max: 100,
      defaultValue: 0,
    },
    {
      name: "minimumAmount",
      label: "Minimum Transaction Amount",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "maximumAmount",
      label: "Maximum Transaction Amount",
      type: "number",
    },
    {
      name: "currency",
      label: "Currency",
      type: "text",
      defaultValue: "INR",
    },
    {
      name: "config",
      label: "Payment Configuration",
      type: "group",
      fields: [
        {
          name: "upiId",
          label: "UPI ID",
          type: "text",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "upi",
          },
        },
        {
          name: "merchantId",
          label: "Merchant ID",
          type: "text",
        },
        {
          name: "apiKey",
          label: "API Key",
          type: "text",
        },
        {
          name: "apiSecret",
          label: "API Secret",
          type: "text",
        },
      ],
    },
    {
      name: "supportedBanks",
      label: "Supported Banks (for Net Banking)",
      type: "array",
      admin: {
        condition: (_, siblingData) => siblingData?.type === "netbanking",
      },
      fields: [
        {
          name: "bankName",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "icon",
      label: "Icon URL",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
    },
  ],
  timestamps: true,
};

export default PaymentMethods;