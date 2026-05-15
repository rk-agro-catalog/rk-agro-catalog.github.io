import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { createHash } from 'crypto'

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
    const apiKey    = process.env.CLOUDINARY_API_KEY!
    const apiSecret = process.env.CLOUDINARY_API_SECRET!
    const folder    = 'rk-agro'
    const timestamp = Math.floor(Date.now() / 1000)

    // Cloudinary signature: SHA1 of "folder=X&timestamp=Y" + apiSecret
    const sig = createHash('sha1')
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex')

    const cloudForm = new FormData()
    cloudForm.append('file', file)
    cloudForm.append('folder', folder)
    cloudForm.append('timestamp', String(timestamp))
    cloudForm.append('api_key', apiKey)
    cloudForm.append('signature', sig)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: cloudForm }
    )

    const data = await res.json()
    if (!res.ok) {
      console.error('Cloudinary error:', data)
      throw new Error(data.error?.message || 'Upload failed')
    }

    return NextResponse.json({ url: data.secure_url })
  } catch (e: any) {
    console.error('Upload route error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
