# R.K. Agro Industries — Free Hosting + Android APK Guide

---

## STEP 1 — Host FREE on Netlify (5 minutes)

### What you get:
- ✅ Free forever (no credit card needed)
- ✅ Live URL like: https://rk-agro.netlify.app
- ✅ HTTPS (required for Android APK)
- ✅ Works on all phones as a web app

### How to deploy:

1. Go to → https://netlify.com
2. Click **"Sign up"** → choose **"Sign up with Email"**
3. After login, go to → https://app.netlify.com/drop
4. **Drag and drop** the folder "rk_agro_app" onto that page
5. Wait 30 seconds → Netlify gives you a URL like:
   👉 https://amazing-rk-agro-12345.netlify.app
6. Click **"Site settings"** → **"Change site name"**
   → Type: rk-agro-catalog → Save
   → Your URL becomes: https://rk-agro-catalog.netlify.app

✅ DONE! Your app is live. Share that URL with anyone.

---

## STEP 2 — Convert to Android APK FREE (PWABuilder)

### What you get:
- ✅ Real .apk file to install on Android phones
- ✅ No Android Studio needed
- ✅ No Google Play account needed
- ✅ Free forever

### How to build APK:

1. First complete Step 1 above to get your live URL
2. Go to → https://www.pwabuilder.com
3. In the box, paste your Netlify URL:
   Example: https://rk-agro-catalog.netlify.app
4. Click **"Start"**
5. Wait ~30 seconds for analysis
6. You will see a score (aim for 100/100)
7. Click **"Package for stores"**
8. Click **"Android"** → Click **"Generate Package"**
9. Fill in:
   - App name: R.K. Agro Industries
   - Package ID: com.rkagro.catalog
   - Version: 1.0.0
10. Click **"Download"**
11. You get a .zip file → extract it → find the .apk file inside

### Install APK on your Android phone:

1. Copy the .apk file to your phone (WhatsApp it to yourself)
2. On your phone: Settings → Security → Enable "Install unknown apps"
3. Open the .apk file → tap Install
4. App appears on your home screen with the RK Agro icon!

---

## STEP 3 — Alternative Free Options

### Option A: GitHub Pages (also free)
1. Create account at github.com
2. New repository → name: rk-agro-catalog → Public
3. Upload all files from rk_agro_app folder
4. Settings → Pages → Branch: main → Save
5. URL: https://yourusername.github.io/rk-agro-catalog

### Option B: Vercel (also free)
1. Go to vercel.com → Sign up
2. Import project → Upload folder
3. Deploy → Get free URL instantly

---

## Your App Login

- Email: admin@nasit.com
- Password: nasit@123

---

## Files in the rk_agro_app folder:

| File | Purpose |
|------|---------|
| index.html | Main app (entire catalog) |
| manifest.json | Makes it installable as app |
| sw.js | Offline support (works without internet) |
| netlify.toml | Netlify configuration |
| icon-192.png | App icon (small) |
| icon-512.png | App icon (large) |

---

## Support

R.K. Agro Industries
Phone: 99240 14448 / 99253 61062
Email: rkagro459@gmail.com
Web: agro-sickles.blogspot.com
