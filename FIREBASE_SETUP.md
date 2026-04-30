# Firebase Setup Guide — 10 Minutes, 100% Free

## Why Firebase?
- Products saved permanently (survive refresh, logout, reinstall)
- Stay logged in after refresh (no re-login)
- Works on all devices simultaneously
- Free plan: 1GB storage, 50,000 reads/day

---

## Step 1 — Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name: rk-agro-catalog
4. Disable Google Analytics (not needed)
5. Click "Create project"

---

## Step 2 — Enable Firestore Database
1. In left menu: Build → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode"
4. Select region: asia-south1 (Mumbai) → Enable

---

## Step 3 — Enable Authentication
1. In left menu: Build → Authentication
2. Click "Get started"
3. Click "Email/Password" → Enable → Save

---

## Step 4 — Get Your Config
1. Click the gear icon (Project Settings)
2. Scroll to "Your apps" → Click "</>" (Web)
3. App nickname: RK Agro → Register app
4. COPY the firebaseConfig object shown

---

## Step 5 — Update index.html
Open index.html and find this section near the top of the script:

  var FB = {
    apiKey: "AIzaSyBxxxxxxxx...",
    authDomain: "rk-agro-catalog.firebaseapp.com",
    ...
  };

Replace the ENTIRE FB object with YOUR config from Step 4.

---

## Step 6 — Upload to Netlify
1. Go to app.netlify.com/drop
2. Drag the rk_agro_app folder
3. Your app is live!

---

## Step 7 — Build Android APK
1. Go to pwabuilder.com
2. Paste your Netlify URL
3. Package for stores → Android → Download APK

---

## Login Credentials
Email:    admin@nasit.com
Password: nasit@123

---

## What Firebase gives you:
✅ Products saved permanently in cloud database
✅ Stay logged in after refresh (no re-login needed)
✅ No URL bar in Android app (fullscreen)
✅ Works offline (cached data)
✅ Real-time sync across devices
✅ FREE forever on Spark plan
