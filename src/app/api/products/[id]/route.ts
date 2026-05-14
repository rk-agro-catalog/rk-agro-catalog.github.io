import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { verifyAdmin } from '@/lib/auth'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = await verifyAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  try {
    const body = await req.json()
    const db = getAdminDb()
    const { id, createdAt, ...data } = body
    await db.collection('products').doc(params.id).update(data)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const admin = await verifyAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  try {
    const db = getAdminDb()
    await db.collection('products').doc(params.id).delete()
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
