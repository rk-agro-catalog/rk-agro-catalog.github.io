'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Dynamically import firebase only on client
    import('@/lib/firebase-client').then(({ auth }) => {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        const unsub = onAuthStateChanged(auth, (user) => {
          if (user) router.replace('/catalog')
          else router.replace('/login')
        })
        return () => unsub()
      })
    })
  }, [router])

  return (
    <div style={{position:'fixed',inset:0,background:'#1a3d1f',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:100,height:100,background:'#c8860a',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:42,fontFamily:'Georgia,serif',fontWeight:700,color:'#fff',marginBottom:18}}>RK</div>
      <div style={{fontSize:30,fontWeight:700,color:'#e8b84b',fontFamily:'Georgia,serif',letterSpacing:3}}>R.K.</div>
      <div style={{fontSize:13,color:'rgba(255,255,255,.7)',letterSpacing:6,marginTop:4,textTransform:'uppercase'}}>Agro</div>
      <div style={{fontSize:10,color:'rgba(255,255,255,.35)',letterSpacing:3,marginTop:2,textTransform:'uppercase'}}>Industries</div>
      <div style={{marginTop:14,background:'rgba(200,134,10,.22)',border:'1px solid rgba(200,134,10,.4)',borderRadius:20,padding:'5px 16px',fontSize:11,color:'#e8b84b'}}>Est. 1998 · Nasit Agro Products</div>
    </div>
  )
}
