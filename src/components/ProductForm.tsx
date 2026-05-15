'use client'
import { useState } from 'react'
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

  // existing = already uploaded URLs, pending = new local files
  const [existing, setExisting] = useState<string[]>(product?.images || [])
  const [pending,  setPending]  = useState<File[]>([])
  const [saving,   setSaving]   = useState(false)
  const [upStatus, setUpStatus] = useState('')

  const totalCount = existing.length + pending.length

  function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const canAdd = 4 - totalCount
    if (canAdd <= 0) return
    setPending(p => [...p, ...files.slice(0, canAdd)])
    e.target.value = ''
  }

  async function handleSave() {
    if (!model.trim() || !name.trim()) { alert('Model aur naam zaroori hai'); return }
    setSaving(true)
    try {
      let allImages = [...existing]

      // Upload each pending file one by one
      for (let i = 0; i < pending.length; i++) {
        setUpStatus(`Image ${i + 1} of ${pending.length} upload ho rahi hai...`)
        const url = await uploadImage(pending[i])
        allImages.push(url)
      }

      setUpStatus('Saving...')
      await onSave({ model, name, category, blade, handle, dims, desc, images: allImages })
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Upload failed'))
      setSaving(false)
      setUpStatus('')
    }
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
        <label>Images ({totalCount}/4)</label>
        <div className="img-row">
          {/* Already uploaded images */}
          {existing.map((url, i) => (
            <div key={url} className="ithumb">
              <img src={url} alt="product"/>
              <button className="rm" onClick={() => setExisting(imgs => imgs.filter((_,j)=>j!==i))}>x</button>
            </div>
          ))}

          {/* Pending local files */}
          {pending.map((f, i) => (
            <div key={i} className="ithumb">
              <img src={URL.createObjectURL(f)} alt="pending"/>
              <button className="rm" onClick={() => setPending(p => p.filter((_,j)=>j!==i))}>x</button>
            </div>
          ))}

          {/* Add button — only show if under 4 */}
          {totalCount < 4 && (
            <label className="iadd" htmlFor="imgFile">
              +
              <input
                id="imgFile"
                type="file"
                accept="image/*"
                multiple
                style={{display:'none'}}
                onChange={addFiles}
              />
            </label>
          )}
        </div>

        {/* Upload progress */}
        {saving && upStatus && (
          <div className="up-prog" style={{marginTop:8}}>
            <div style={{fontSize:11,color:'#2d7a1f',fontWeight:500}}>{upStatus}</div>
            <div className="up-bg">
              <div className="up-fill" style={{width: upStatus.includes('Saving') ? '100%' : '60%'}}/>
            </div>
          </div>
        )}
      </div>

      <div className="f-acts">
        <button className="f-cancel" onClick={onCancel} disabled={saving}>Cancel</button>
        <button className="f-save" onClick={handleSave} disabled={saving}>
          {saving ? upStatus || 'Saving...' : 'Save Product'}
        </button>
      </div>
    </>
  )
}
