'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase-client'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace('/catalog')
    })
    return () => unsub()
  }, [router])

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace('/catalog')
    } catch {
      setError('Wrong email or password')
      setLoading(false)
    }
  }

  return (
    <div className="lg-wrap">
      <div className="lg-em">RK</div>
      <div className="lg-t1">R.K. Agro Industries</div>
      <div className="lg-t2">Admin Portal</div>

      <form className="lg-card" onSubmit={handleLogin}>
        <div className="lf">
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@nasit.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="lf">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="lg-err">{error}</p>}
        <button className="lg-btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
