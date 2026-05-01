declare const global: any

import payload from 'payload'
import admin from 'firebase-admin'

export type AlertType =
  | 'info'
  | 'warning'
  | 'emergency'
  | 'payment_fail'
  | 'booking'
  | 'system'

// ================= FIREBASE INIT =================
if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined

    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      privateKey
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// ================= PUSH FUNCTION =================
const sendPush = async (
  tokens: string[],
  title: string,
  body: string,
  data?: any
) => {
  if (!admin.apps.length) return

  return admin.messaging().sendEachForMulticast({
    notification: { title, body },
    data: data || {},
    tokens: tokens.filter(Boolean),
  })
}

// ================= ALERT SERVICE =================
export const alertService = {

  async createAlert(data: {
    title: string
    message: string
    type: AlertType
    triggeredBy?: string
    userTokens?: string[]
  }) {

    const alert = await payload.create({
      collection: 'alerts',
      data: {
        title: data.title,
        message: data.message,
        type: data.type as any,
        triggeredBy: data.triggeredBy || 'system',
        isRead: false,
      },
    })

    // realtime
    global.io?.emit('alert:new', alert)

    // push
    if (data.userTokens?.length) {
      await sendPush(
        data.userTokens,
        data.title,
        data.message,
        { type: data.type, alertId: String(alert.id) }
      )
    }

    return alert
  },

  bookingAlert(data: any) {
    return this.createAlert({
      title: 'Booking Confirmed 🚖',
      message: 'Your ride is booked',
      type: 'booking',
      ...data,
    })
  },

  paymentSuccess(data: any) {
    return this.createAlert({
      title: 'Payment Success ✅',
      message: 'Payment completed',
      type: 'info',
      ...data,
    })
  },

  paymentFailed(data: any) {
    return this.createAlert({
      title: 'Payment Failed ❌',
      message: 'Payment failed',
      type: 'payment_fail',
      ...data,
    })
  },

  systemError(err: any) {
    return this.createAlert({
      title: 'System Error ⚠️',
      message: err?.message || 'Error occurred',
      type: 'emergency',
    })
  },
}