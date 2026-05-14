# RK Agro — Next.js Setup & Deploy Guide

## Security kya change hua?

| Pehle (HTML) | Ab (Next.js) |
|---|---|
| Firebase key browser mein visible ❌ | Firebase key sirf server par ✅ |
| `nasit@123` password source code mein ❌ | Koi password code mein nahi ✅ |
| Cloudinary secret exposed ❌ | Upload server-side hota hai ✅ |
| Koi bhi API call kar sakta tha ❌ | Sirf logged-in admin kar sakta hai ✅ |

---

## Step 1 — Firebase Admin SDK setup

1. https://console.firebase.google.com jao
2. Apna project open karo (rk-agro-catalog)
3. **Project Settings** → **Service accounts** tab
4. **"Generate new private key"** button dabao
5. JSON file download hogi — isse open karo

Us JSON mein yeh values milenge:
```
"project_id": "rk-agro-catalog",
"client_email": "firebase-adminsdk-xxxxx@rk-agro-catalog.iam.gserviceaccount.com",
"private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## Step 2 — .env.local file banao

Project folder mein `.env.local` file banao (`.env.local.example` copy karo):

```
# ✅ Yeh sab already fill hai — kuch mat badlo
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCp6b-aYosCsl_U4weiD9NlKMjoqntdkcE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rk-agro-catalog.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rk-agro-catalog
FIREBASE_ADMIN_PROJECT_ID=rk-agro-catalog
CLOUDINARY_CLOUD_NAME=dpdh3s5bc
ADMIN_EMAIL=admin@nasit.com

# ⚠️ SIRF YEH 3 VALUES BHARO (Step 1 aur Step 3 se):
FIREBASE_ADMIN_CLIENT_EMAIL=       <-- Step 1 ki JSON se
FIREBASE_ADMIN_PRIVATE_KEY=""      <-- Step 1 ki JSON se (poori key quotes mein)
CLOUDINARY_API_KEY=                <-- cloudinary.com/console → Settings → Access Keys
CLOUDINARY_API_SECRET=             <-- cloudinary.com/console → Settings → Access Keys
```

⚠️ `.env.local` GitHub pe KABHI push mat karo — `.gitignore` mein already add hai

---

## Step 3 — Cloudinary signed preset banao

1. https://cloudinary.com/console jao
2. **Settings** → **Upload** → **Upload presets**
3. **Add upload preset** → Name: `rk_agro_signed`
4. **Signing Mode: Signed** select karo (pehle Unsigned tha — change karo)
5. Folder: `rk-agro` set karo
6. Save karo

---

## Step 4 — Local mein test karo

```bash
npm install
npm run dev
```

Browser mein: http://localhost:3000

---

## Step 5 — Vercel pe deploy karo (free)

### Option A: CLI se
```bash
npm i -g vercel
vercel
```

### Option B: GitHub se (recommended — auto-deploy)
1. GitHub pe naya repo banao: `rk-agro-catalog`
2. Yeh folder push karo:
   ```bash
   git init
   git add .
   git commit -m "Initial Next.js app"
   git remote add origin https://github.com/TUMHARA_USERNAME/rk-agro-catalog
   git push -u origin main
   ```
3. https://vercel.com/new jao
4. GitHub repo import karo
5. **Environment Variables** section mein `.env.local` ki saari values add karo
6. Deploy!

Ab har `git push` par automatic deploy hoga ✅

---

## Firestore Security Rules

Firebase Console → Firestore → Rules mein yeh lagao:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.auth.token.email == "admin@nasit.com";
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Project structure

```
rk-agro/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── products/       ← GET/POST products (server)
│   │   │   │   └── [id]/       ← PUT/DELETE by id (server)
│   │   │   └── upload/         ← Cloudinary upload (server)
│   │   ├── catalog/            ← Main catalog page
│   │   ├── login/              ← Login page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ProductForm.tsx     ← Add/edit form
│   │   └── ShareSheet.tsx      ← WhatsApp/PDF share
│   └── lib/
│       ├── firebase-client.ts  ← Auth only (browser)
│       ├── firebase-admin.ts   ← Full DB access (server only)
│       ├── auth.ts             ← Token verify helper
│       └── useProducts.ts      ← Products hook
├── .env.local.example
├── .gitignore
└── SETUP_GUIDE.md
```
