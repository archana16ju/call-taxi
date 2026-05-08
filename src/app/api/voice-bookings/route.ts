"use client"

import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayload({ config })
  
  try {
    const bookings = await payload.find({
      collection: 'voice-bookings' as any,
      sort: '-createdAt',
      limit: 100,
    })

    return NextResponse.json(bookings.docs)
  } catch (err) {
    console.error('Fetch Voice Bookings Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  
  try {
    const data = await req.json()
    
    // AI LOGIC MOCKUP (Whisper / Extraction)
    // In a real scenario, you'd send audio to Whisper here.
    // For this implementation, we assume text extraction or a trigger.
    
    const newBooking = await payload.create({
      collection: 'voice-bookings' as any,
      data: {
        bookingId: `VB-${Math.floor(1000 + Math.random() * 9000)}`,
        status: data.status || 'confirmed',
        transcript: data.transcript || 'Book a taxi from Heathrow to Central London.',
        pickup: {
          address: data.pickup || 'Heathrow Airport, Terminal 5',
          lat: 51.4700,
          lng: -0.4543,
        },
        dropoff: {
          address: data.dropoff || 'Central London, Victoria Station',
          lat: 51.4952,
          lng: -0.1439,
        },
        fare: {
          amount: data.fare || 65,
          currency: 'GBP',
        },
        driver: {
          name: 'Sarah Williams',
          id: 'DRV-8821',
          vehicle: 'Tesla Model 3 (Black)',
        },
        ai: {
          confidence: data.confidence || 98,
          voiceProvider: 'Google Text-to-Speech',
          speechToText: 'OpenAI Whisper',
        },
        allocatedTime: '18:45',
        estimatedArrival: '12 mins',
        bookingType: 'premium',
      },
    })

    // Trigger realtime update if socket.io was integrated
    // (User mentioned socket.io, but usually we'd use a server-side emitter)

    return NextResponse.json(newBooking)
  } catch (err) {
    console.error('Create Voice Booking Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
