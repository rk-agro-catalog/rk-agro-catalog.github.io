'use client'
import { Product } from '@/lib/useProducts'

interface Props {
  product: Product
  onClose: () => void
}

function waMsg(p: Product) {
  return `*R.K. Agro Industries*\n\n*Product:* ${p.name}\n*Model:* ${p.model}\n*Category:* ${p.category}\n\n*Blade:* ${p.blade}\n*Handle:* ${p.handle}\n*Size:* ${p.dims}\n\n${p.desc}\n\nPhone: 99240 14448\nEmail: rkagro459@gmail.com`
}

async function makePDF(p: Product) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, M = 18
  doc.setFillColor(26,61,31); doc.rect(0,0,W,46,'F')
  doc.setFillColor(200,134,10); doc.roundedRect(M,8,22,22,3,3,'F')
  doc.setTextColor(255,255,255); doc.setFontSize(12); doc.setFont('helvetica','bold')
  doc.text('RK', M+11, 22, { align: 'center' })
  doc.setFontSize(17); doc.text('R.K. Agro Industries', W/2, 17, { align: 'center' })
  doc.setFontSize(9); doc.setFont('helvetica','normal')
  doc.text('Professional Agricultural Tools - Est. 1998', W/2, 24, { align: 'center' })
  doc.setFillColor(200,134,10); doc.rect(0,46,W,1.2,'F')
  let y = 60
  doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(26,61,31)
  doc.text((p.name||'').toUpperCase(), W/2, y+6, { align: 'center' }); y+=16
  const rows = [['Model',p.model],['Category',p.category],['Blade',p.blade],['Handle',p.handle],['Size',p.dims],['Description',p.desc]]
  const cw = W-2*M
  rows.forEach((r,i) => {
    doc.setFillColor(i%2===0?250:255,i%2===0?248:255,i%2===0?244:255)
    doc.rect(M,y,cw,11,'F')
    doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(160,120,50)
    doc.text(r[0].toUpperCase(), M+4, y+7)
    doc.setFont('helvetica','normal'); doc.setTextColor(40,40,40)
    doc.text(doc.splitTextToSize(r[1]||'-', cw-56)[0], M+54, y+7)
    y+=11
  })
  y+=8
  doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(26,61,31)
  doc.text('NASIT AGRO PRODUCTS', M, y)
  doc.setFont('helvetica','normal'); doc.setTextColor(130,130,130)
  y+=5; doc.text('Sopan Ind. Area, Plot No.16, Shapar (Veraval)-360024, Dist. Rajkot, Gujarat.', M, y)
  y+=4; doc.text('GSTIN: 24AEZPN5075R1ZB | Phone: 99240 14448 / 99253 61062', M, y)
  doc.setFillColor(26,61,31); doc.rect(0,283,W,14,'F')
  doc.setTextColor(180,200,180); doc.setFontSize(7)
  doc.text('www.nasit-agri.com | agro-sickles.blogspot.com | Since 1998', W/2, 291, { align: 'center' })
  return doc
}

export default function ShareSheet({ product: p, onClose }: Props) {
  const fname = `RK_${(p.model||'').replace(/\s+/g,'_')}.pdf`

  async function doWA() {
    onClose()
    const msg = waMsg(p)
    const doc = await makePDF(p)
    try {
      const blob = doc.output('blob')
      const file = new File([blob], fname, { type: 'application/pdf' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `R.K. Agro - ${p.name}`, text: msg, files: [file] })
        return
      }
    } catch {}
    doc.save(fname)
    setTimeout(() => window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank'), 700)
  }

  function doCopy() {
    navigator.clipboard?.writeText(waMsg(p))
    onClose()
  }

  async function doEmail() {
    onClose()
    const doc = await makePDF(p)
    doc.save(fname)
    const s = encodeURIComponent(`R.K. Agro - ${p.name}`)
    const b = encodeURIComponent(`Dear Customer,\n\nProduct: ${p.name}\nModel: ${p.model}\n\n${p.desc}\n\nR.K. Agro Industries\n99240 14448`)
    setTimeout(() => window.open(`mailto:?subject=${s}&body=${b}`, '_blank'), 300)
  }

  async function doDownload() {
    onClose()
    const doc = await makePDF(p)
    doc.save(fname)
  }

  return (
    <>
      <div className="sh-hd">{p.name}</div>
      <div className="sh-sd">Model: {p.model} | {p.category}</div>
      <div className="pdf-box">
        <div className="pdf-ic">PDF</div>
        <div><div className="pdf-nm">{fname}</div><div style={{fontSize:10,color:'#bbb'}}>R.K. Agro Industries</div></div>
      </div>
      <div className="sh-opts">
        <div className="sopt wa" onClick={doWA}>
          <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#25D366"/><path fill="#fff" d="M22.5 9.5C20.8 7.8 18.5 6.9 16 6.9c-5.1 0-9.2 4.1-9.2 9.2 0 1.6.4 3.2 1.2 4.6L6.8 25.1l4.5-1.2c1.3.7 2.8 1.1 4.5 1.1 5.1 0 9.2-4.1 9.2-9.2 0-2.4-.9-4.7-2.5-6.3z"/></svg>
          <div><div className="so-l">WhatsApp</div><div className="so-s">Share PDF</div></div>
        </div>
        <div className="sopt" onClick={doCopy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          <div><div className="so-l">Copy Info</div><div className="so-s">Clipboard</div></div>
        </div>
        <div className="sopt" onClick={doEmail}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
          <div><div className="so-l">Email</div><div className="so-s">Send mail</div></div>
        </div>
        <div className="sopt" onClick={doDownload}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#c8860a" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <div><div className="so-l">Download</div><div className="so-s">Save PDF</div></div>
        </div>
      </div>
      <button className="sh-cls" onClick={onClose}>Cancel</button>
    </>
  )
}
