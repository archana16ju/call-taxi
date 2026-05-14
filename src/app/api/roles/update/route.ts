import { NextResponse } from 'next/server'

let ROLE_DB: Record<string, any> = {}

export async function GET() {
  return NextResponse.json(ROLE_DB)
}
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { role, permissions, active } = body

    if (!role) {
      return NextResponse.json(
        { success: false, message: 'role is required' },
        { status: 400 }
      )
    }

    ROLE_DB[role] = {
      permissions: permissions || [],
      active: active ?? true,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: ROLE_DB[role],
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}