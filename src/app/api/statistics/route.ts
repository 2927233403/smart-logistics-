import { NextResponse } from 'next/server'
import { getStatistics } from '@/lib/dataStore'

export async function GET() {
  const statistics = getStatistics()
  return NextResponse.json(statistics)
}
