import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { verifyAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  // Anyone logged in can read products (catalog view)
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getAdminDb()
    const snap = await db.collection('products').orderBy('createdAt', 'asc').get()
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(products)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  // Only admin can add products
  const admin = await verifyAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const db = getAdminDb()

    const data = {
      model:    body.model    || '',
      name:     body.name     || '',
      category: body.category || '',
      blade:    body.blade    || '',
      handle:   body.handle   || '',
      dims:     body.dims     || '',
      desc:     body.desc     || '',
      images:   body.images   || [],
      createdAt: new Date(),
    }

    const ref = await db.collection('products').add(data)
    return NextResponse.json({ id: ref.id, ...data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
