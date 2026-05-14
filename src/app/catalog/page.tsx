'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase-client'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useProducts, Product } from '@/lib/useProducts'
import ProductForm from '@/components/ProductForm'
import ShareSheet from '@/components/ShareSheet'

type Sheet = 'none' | 'add' | 'edit' | 'share' | 'delete'

export default function CatalogPage() {
  const router = useRouter()
  const { products, status, msg, addProduct, updateProduct, deleteProduct, uploadImage } = useProducts()

  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('All')
  const [sheet,    setSheet]    = useState<Sheet>('none')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [toast,    setToast]    = useState('')
  const [toastOn,  setToastOn]  = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) router.replace('/login')
    })
    return () => unsub()
  }, [router])

  function showToast(msg: string) {
    setToast(msg); setToastOn(true)
    setTimeout(() => setToastOn(false), 3500)
  }

  function closeSheet() { setSheet('none'); setActiveId(null) }

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const match = (p.name||'').toLowerCase().includes(q) ||
                  (p.model||'').toLowerCase().includes(q) ||
                  (p.category||'').toLowerCase().includes(q)
    return match && (filter === 'All' || p.category === filter)
  })

  const activeProduct = products.find(p => p.id === activeId)

  const categories = ['All','Sickle','Darati','Farming Tool','Other']
  const catCounts = new Set(products.map(p => p.category).filter(Boolean)).size

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="tb-em">RK</div>
        <div style={{flex:1}}>
          <div className="tb-main">R.K. Agro Industries</div>
          <div className="tb-sub">Product Catalog</div>
        </div>
        <button className="tb-out" onClick={async () => { await signOut(auth); router.replace('/login') }}>
          Logout
        </button>
      </div>

      <div className="cat-body">
        {/* Banner */}
        <div className="banner">
          <div className="bn-top">
            <div className="bn-em">RK</div>
            <div>
              <div className="bn-n1">R.K. Agro Industries</div>
              <div className="bn-n2">Nasit · Est.1998 · Gujarat</div>
            </div>
          </div>
          <div className="bn-stats">
            <div className="bst"><div className="bst-n">{products.length}</div><div className="bst-l">Products</div></div>
            <div className="bst"><div className="bst-n">{catCounts}</div><div className="bst-l">Categories</div></div>
            <div className="bst"><div className="bst-n">0</div><div className="bst-l">Shared</div></div>
          </div>
          <div className="bn-ct">📞 99240 14448 &nbsp;·&nbsp; rkagro459@gmail.com</div>
        </div>

        {/* DB status */}
        <div className={`db-pill ${status}`}>
          <div className="db-dot"></div>
          <span>{msg}</span>
        </div>

        {/* Search */}
        <div className="srch">
          <svg className="srch-ic" width="14" height="14" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        {/* Filter tabs */}
        <div className="ftabs">
          {categories.map(c => (
            <div key={c} className={`ftab${filter===c?' on':''}`} onClick={()=>setFilter(c)}>{c}</div>
          ))}
        </div>

        <div className="sumrow">
          <div className="sumtxt">
            <b>{filtered.length}</b> product{filtered.length!==1?'s':''}
            {filter!=='All' && <span style={{color:'#c8860a'}}> · {filter}</span>}
          </div>
        </div>

        <button className="add-btn" onClick={() => setSheet('add')}>
          <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Product
        </button>

        {/* Product grid */}
        <div className="grid">
          {!filtered.length ? (
            <div className="empty">
              <div className="ei">🌿</div>
              <p>No products.<br/>Tap Add New Product.</p>
            </div>
          ) : filtered.map(p => (
            <div key={p.id} className="card">
              {p.images?.length > 0 && (
                <div className="card-imgs">
                  {p.images.slice(0,2).map(url => <img key={url} className="cimg" src={url} loading="lazy" alt={p.name}/>)}
                  {p.images.length > 2 && <div className="cmore">+{p.images.length-2}</div>}
                </div>
              )}
              {!p.images?.length && (
                <div className="card-imgs"><div className="cph">🌿</div></div>
              )}
              <div className="card-body">
                <div className="c-model">{p.model} · {p.category}</div>
                <div className="c-name">{p.name}</div>
                <div className="c-spec">
                  {p.blade && <>Blade: {p.blade}<br/></>}
                  {p.handle && <>Handle: {p.handle}<br/></>}
                  {p.dims && <>Size: {p.dims}</>}
                </div>
                {p.desc && <div className="c-desc">{p.desc}</div>}
                <div className="c-acts">
                  <button className="c-edit" onClick={()=>{setActiveId(p.id);setSheet('edit')}}>Edit</button>
                  <button className="c-share" onClick={()=>{setActiveId(p.id);setSheet('share')}}>Share</button>
                  <button className="c-del" onClick={()=>{setActiveId(p.id);setSheet('delete')}}>
                    <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {sheet !== 'none' && <div className="ov" onClick={closeSheet}/>}

      {/* Add/Edit sheet */}
      <div className={`sheet${sheet==='add'||sheet==='edit'?' show':''}`}>
        <div className="sh-bar"/>
        <div className="sh-body">
          {(sheet==='add'||sheet==='edit') && (
            <ProductForm
              product={sheet==='edit' ? activeProduct : undefined}
              uploadImage={uploadImage}
              onCancel={closeSheet}
              onSave={async (data) => {
                if (sheet==='add') {
                  await addProduct(data)
                  showToast('Product add ho gaya!')
                } else if (activeId) {
                  await updateProduct(activeId, data)
                  showToast('Product update ho gaya!')
                }
                closeSheet()
              }}
            />
          )}
        </div>
      </div>

      {/* Share sheet */}
      <div className={`sheet${sheet==='share'?' show':''}`}>
        <div className="sh-bar"/>
        <div className="sh-body">
          {sheet==='share' && activeProduct && (
            <ShareSheet product={activeProduct} onClose={closeSheet}/>
          )}
        </div>
      </div>

      {/* Delete confirm sheet */}
      <div className={`sheet${sheet==='delete'?' show':''}`}>
        <div className="sh-bar"/>
        <div className="sh-body">
          <div className="cf-ic">🗑️</div>
          <div className="cf-t">Delete Product?</div>
          <div className="cf-s">Database se permanently delete hoga.</div>
          <div className="cf-acts">
            <button className="cf-no" onClick={closeSheet}>Cancel</button>
            <button className="cf-yes" onClick={async () => {
              if (!activeId) return
              await deleteProduct(activeId)
              showToast('Product delete ho gaya!')
              closeSheet()
            }}>Delete</button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${toastOn?' show':''}`}>{toast}</div>
    </>
  )
}
