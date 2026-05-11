import { NextRequest, NextResponse } from 'next/server'

import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      driverId,
      lat,
      lng,
      tripActive,
    } = body

    const payload = await getPayload({
      config,
    })

    const status = tripActive
      ? 'onduty'
      : 'available'

    const updated = await payload.update({
      collection: 'drivers',

      id: driverId,

      data: {
        status,

        location: [lng, lat],
      },
    })

    return NextResponse.json(updated)

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error: 'Failed to update driver location',
      },
      {
        status: 500,
      },
    )
  }
}