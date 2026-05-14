import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// This file only runs on the SERVER (API routes)
// Credentials are NEVER sent to the browser

let adminApp: App

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]

  adminApp = initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
  return adminApp
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}
