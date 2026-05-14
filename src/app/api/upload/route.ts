import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    // Upload to Cloudinary using API secret (server-side only)
    const cloudForm = new FormData()
    cloudForm.append('file', file)
    cloudForm.append('upload_preset', 'rk_agro_signed') // use signed preset
    cloudForm.append('folder', 'rk-agro')

    const timestamp = Math.floor(Date.now() / 1000)
    cloudForm.append('timestamp', String(timestamp))
    cloudForm.append('api_key', process.env.CLOUDINARY_API_KEY!)

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: cloudForm }
    )

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Upload failed')

    return NextResponse.json({ url: data.secure_url })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
