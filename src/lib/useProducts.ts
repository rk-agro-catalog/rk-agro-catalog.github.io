'use client'
import { useState, useEffect, useCallback } from 'react'
import { auth } from '@/lib/firebase-client'

export interface Product {
  id: string
  model: string
  name: string
  category: string
  blade: string
  handle: string
  dims: string
  desc: string
  images: string[]
}

async function getToken() {
  return await auth.currentUser?.getIdToken()
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<'load' | 'ok' | 'err'>('load')
  const [msg, setMsg] = useState('Connecting...')

  const fetchProducts = useCallback(async () => {
    setStatus('load')
    try {
      const token = await getToken()
      const res = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProducts(data)
      setStatus('ok')
      setMsg(`Live database · ${data.length} products`)
    } catch (e: any) {
      setStatus('err')
      setMsg('Error: ' + e.message)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  async function addProduct(data: Omit<Product, 'id'>) {
    const token = await getToken()
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error((await res.json()).error)
    await fetchProducts()
  }

  async function updateProduct(id: string, data: Partial<Product>) {
    const token = await getToken()
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error((await res.json()).error)
    await fetchProducts()
  }

  async function deleteProduct(id: string) {
    const token = await getToken()
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error((await res.json()).error)
    await fetchProducts()
  }

  async function uploadImage(file: File): Promise<string> {
    const token = await getToken()
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    if (!res.ok) throw new Error((await res.json()).error)
    return (await res.json()).url
  }

  return { products, status, msg, addProduct, updateProduct, deleteProduct, uploadImage, refresh: fetchProducts }
}
