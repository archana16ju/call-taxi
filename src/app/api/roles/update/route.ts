import { NextResponse } from 'next/server'

let ROLE_DB: Record<string, any> = {}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { role, permissions, active } = body

    if (!role) {
      return NextResponse.json(
        { success: false, message: 'role is required' },
        { status: 400 },
      )
    }

    ROLE_DB[role] = {
      permissions,
      active,
    }

    return NextResponse.json({
      success: true,
      data: ROLE_DB[role],
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    )
  }
}