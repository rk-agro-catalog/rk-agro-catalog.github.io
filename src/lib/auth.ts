import { getAuth } from 'firebase-admin/auth'
import { getAdminDb } from './firebase-admin'
import { NextRequest } from 'next/server'

export async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  try {
    const decoded = await getAuth().verifyIdToken(token)
    if (decoded.email !== process.env.ADMIN_EMAIL) return null
    return decoded
  } catch {
    return null
  }
}
