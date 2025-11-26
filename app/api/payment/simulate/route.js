import { NextResponse } from 'next/server'

export async function POST() {
  // This simulates a successful payment processing
  return NextResponse.json({ success: true, reference: 'mock_' + Date.now() })
}
