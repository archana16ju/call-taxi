// app/api/roles/update/route.ts

import { NextResponse } from 'next/server'

// TEMP storage (replace with DB or Payload CMS later)
let ROLE_DB: Record<string, any> = {}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { roleName, permissions, active } = body

    if (!roleName) {
      return NextResponse.json(
        { success: false, message: 'roleName is required' },
        { status: 400 },
      )
    }

    // Save/update role
    ROLE_DB[roleName] = {
      permissions,
      active,
    }

    return NextResponse.json({
      success: true,
      data: ROLE_DB[roleName],
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    )
  }
}