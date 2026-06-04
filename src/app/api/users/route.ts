import { NextResponse } from 'next/server'
import { getUsers, addUser, updateUser, deleteUser } from '@/lib/dataStore'

export async function GET() {
  const users = getUsers()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newUser = addUser(body)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json()
    const updated = updateUser(id, updates)
    if (updated) {
      return NextResponse.json(updated)
    }
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (id) {
      const deleted = deleteUser(id)
      if (deleted) {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
