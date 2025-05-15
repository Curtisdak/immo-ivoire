import { NextResponse } from 'next/server'

export default function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  )
}
