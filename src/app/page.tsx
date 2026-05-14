'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase-client'
import { onAuthStateChanged } from 'firebase/auth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.replace('/catalog')
      } else {
        router.replace('/login')
      }
    })
    return () => unsub()
  }, [router])

  return (
    <div id="splash">
      <div className="sp-logo">RK</div>
      <div className="sp-n1">R.K.</div>
      <div className="sp-n2">Agro</div>
      <div className="sp-n3">Industries</div>
      <div className="sp-badge">Est. 1998 · Nasit Agro Products</div>
      <div className="sp-loader">
        <div className="sp-bg"><div className="sp-fill" style={{width:'80%'}}></div></div>
        <div className="sp-txt">Loading...</div>
      </div>
    </div>
  )
}
