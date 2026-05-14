'use client'
import { useState, useEffect } from 'react'
import { Product } from '@/lib/useProducts'

interface Props {
  product?: Product
  onSave: (data: Omit<Product, 'id'>) => Promise<void>
  onCancel: () => void
  uploadImage: (file: File) => Promise<string>
}

export default function ProductForm({ product, onSave, onCancel, uploadImage }: Props) {
  const [model,    setModel]    = useState(product?.model    || '')
  const [name,     setName]     = useState(product?.name     || '')
  const [category, setCategory] = useState(product?.category || '')
  const [blade,    setBlade]    = useState(product?.blade    || '')
  const [handle,   setHandle]   = useState(product?.handle   || '')
  const [dims,     setDims]     = useState(product?.dims     || '')
  const [desc,     setDesc]     = useState(product?.desc     || '')
  const [images,   setImages]   = useState<string[]>(product?.images || [])
  const [pending,  setPending]  = useState<File[]>([])
  const [saving,   setSaving]   = useState(false)
  const [upPct,    setUpPct]    = useState(0)

  async function handleSave() {
    if (!model.trim() || !name.trim()) { alert('Model aur naam zaroori hai'); return }
    setSaving(true)
    try {
      let allImages = [...images]
      if (pending.length > 0) {
        for (let i = 0; i < pending.length; i++) {
          setUpPct(Math.round((i / pending.length) * 100))
          const url = await uploadImage(pending[i])
          allImages.push(url)
        }
        setUpPct(100)
      }
      await onSave({ model, name, category, blade, handle, dims, desc, images: allImages })
    } finally {
      setSaving(false)
      setUpPct(0)
    }
  }

  function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setPending(p => [...p, ...files].slice(0, 4 - images.length))
    e.target.value = ''
  }

  return (
    <>
      <div className="sh-title">{product ? 'Edit Product' : 'Add Product'}</div>

      <div className="ff"><label>Model No.</label>
        <input value={model} onChange={e=>setModel(e.target.value)} placeholder="e.g. P03 Black"/></div>
      <div className="ff"><label>Product Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Agricultural Sickle"/></div>
      <div className="ff"><label>Category</label>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">Select...</option>
          <option>Sickle</option><option>Darati</option>
          <option>Farming Tool</option><option>Other</option>
        </select></div>
      <div className="ff"><label>Blade</label>
        <input value={blade} onChange={e=>setBlade(e.target.value)} placeholder="e.g. High-Carbon Steel"/></div>
      <div className="ff"><label>Handle</label>
        <input value={handle} onChange={e=>setHandle(e.target.value)} placeholder="e.g. Rubber Grip"/></div>
      <div className="ff"><label>Size / Weight</label>
        <input value={dims} onChange={e=>setDims(e.target.value)} placeholder="e.g. 14 inch, 250g"/></div>
      <div className="ff"><label>Description</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Details..."/></div>

      <div className="ff">
        <label>Images</label>
        <div className="img-row">
          {images.map((url, i) => (
            <div key={url} className="ithumb">
              <img src={url} alt="product"/>
              <button className="rm" onClick={() => setImages(imgs => imgs.filter((_,j)=>j!==i))}>x</button>
            </div>
          ))}
          {pending.map((f, i) => (
            <div key={i} className="ithumb">
              <img src={URL.createObjectURL(f)} alt="pending"/>
              <button className="rm" onClick={() => setPending(p => p.filter((_,j)=>j!==i))}>x</button>
            </div>
          ))}
          {images.length + pending.length < 4 && (
            <label className="iadd" htmlFor="imgFile">+
              <input id="imgFile" type="file" accept="image/*" multiple style={{display:'none'}} onChange={addFiles}/>
            </label>
          )}
        </div>
        {saving && pending.length > 0 && (
          <div className="up-prog">
            <div style={{fontSize:11,color:'#2d7a1f'}}>Uploading... {upPct}%</div>
            <div className="up-bg"><div className="up-fill" style={{width:`${upPct}%`}}></div></div>
          </div>
        )}
      </div>

      <div className="f-acts">
        <button className="f-cancel" onClick={onCancel}>Cancel</button>
        <button className="f-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </>
  )
}
