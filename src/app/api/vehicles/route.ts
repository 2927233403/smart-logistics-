import { NextResponse } from 'next/server'
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '@/lib/dataStore'

export async function GET() {
  const vehicles = getVehicles()
  return NextResponse.json(vehicles)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newVehicle = addVehicle(body)
    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json()
    const updated = updateVehicle(id, updates)
    if (updated) {
      return NextResponse.json(updated)
    }
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (id) {
      const deleted = deleteVehicle(id)
      if (deleted) {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
