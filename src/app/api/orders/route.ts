import { NextResponse } from 'next/server'
import { getOrders, addOrder, updateOrder, deleteOrderApi } from '@/lib/dataStore'

export async function GET() {
  const orders = getOrders()
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newOrder = addOrder(body)
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json()
    const updated = updateOrder(id, updates)
    if (updated) {
      return NextResponse.json(updated)
    }
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (id) {
      const deleted = deleteOrderApi(id)
      if (deleted) {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
