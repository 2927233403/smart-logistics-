import { NextResponse } from 'next/server'
import { getMessages, addMessage, markMessageRead, markAllMessagesRead, deleteMessage } from '@/lib/dataStore'

export async function GET() {
  const messages = getMessages()
  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle mark all read
    if (body.action === 'markAllRead') {
      const messages = markAllMessagesRead()
      return NextResponse.json(messages)
    }
    
    const newMessage = addMessage(body)
    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, action, reply, replyTime } = body
    
    if (action === 'markRead') {
      const updated = markMessageRead(id)
      if (updated) {
        return NextResponse.json(updated)
      }
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    
    if (action === 'reply' && reply) {
      const messages = getMessages()
      const index = messages.findIndex(m => m.id === id)
      if (index !== -1) {
        messages[index].read = true
        messages[index].reply = reply
        messages[index].replyTime = replyTime
        return NextResponse.json(messages[index])
      }
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (id) {
      const deleted = deleteMessage(id)
      if (deleted) {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
