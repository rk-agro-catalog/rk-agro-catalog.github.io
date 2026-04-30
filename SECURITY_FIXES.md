# Security Fixes for RK Agro Catalog

## 🔴 Critical Issues Found

### 1. Exposed Firebase Credentials
**Problem**: API keys, project ID, and auth domain are hardcoded in `index.html`
**Risk**: Anyone can use these credentials to access your database

**Solution**: Move to `.env` file (added `.env.example`)

```javascript
// ❌ BEFORE (Exposed):
firebase.initializeApp({
  apiKey: "AIzaSyCp6b-aYosCsl_U4weiD9NlKMjoqntdkcE",
  authDomain: "rk-agro-catalog.firebaseapp.com",
  projectId: "rk-agro-catalog",
  ...
});

// ✅ AFTER (Protected):
firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  ...
});
```

### 2. Hardcoded Admin Password
**Problem**: Admin password visible in plain text on line 323
```javascript
var ADMIN_PASS  = "nasit@123";  // 🚨 EXPOSED!
```

**Risk**: Anyone viewing the source code can see the password

**Solution**: Use Firebase Authentication only
- Remove hardcoded password
- Use Firebase email/password authentication
- Implement Firebase Custom Claims for admin role

### 3. Exposed Cloudinary Credentials
**Problem**: Cloudinary name and upload preset visible in code (lines 37-38)
**Risk**: Anyone can upload files to your Cloudinary account

**Solution**: Move to `.env.example` (see `.env.example` file)

---

## 📋 Action Plan

### Immediate (Today):
1. **Regenerate Firebase API Key**
   - Go to: https://console.firebase.google.com
   - Project Settings → API Keys
   - Delete or restrict the exposed key
   - The old key (AIzaSyCp6b...) will no longer work

2. **Enable Firestore Security Rules** (Copy below)

3. **Add `.gitignore`** ✅ Done

4. **Add `.env.example`** ✅ Done

### Short Term (This Week):
1. Create local `.env` file with actual credentials (NOT committed)
2. Update `index.html` to use environment variables
3. Test on local machine
4. Deploy with new credentials

---

## 🔒 Firestore Security Rules

Copy this to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only admin can read/write products
    match /products/{document=**} {
      allow read, write: if request.auth != null && 
                            hasRole(request.auth.uid, 'admin');
    }
    
    // Admin management (only during setup)
    match /admins/{uid} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == uid;
    }
  }
  
  function hasRole(uid, role) {
    return get(/databases/$(database)/documents/admins/$(uid)).data.role == role;
  }
}
```

---

## 📝 Updated Authentication Flow

### Old (Insecure):
```javascript
var ADMIN_EMAIL = "admin@nasit.com";
var ADMIN_PASS  = "nasit@123";  // ❌ Visible to everyone
```

### New (Secure):
```javascript
// Only use Firebase Authentication
auth.signInWithEmailAndPassword(email, password)
  .then(user => {
    // Check if user is admin via Custom Claims
    user.getIdTokenResult().then(idTokenResult => {
      if (idTokenResult.claims.admin) {
        // Show admin dashboard
      }
    });
  });
```

---

## ✅ Checklist

- [ ] Regenerate Firebase API Key (invalidate old key)
- [ ] Create local `.env` file with real credentials
- [ ] Add `.env.example` ✅
- [ ] Add `.gitignore` ✅
- [ ] Update Firebase Security Rules
- [ ] Remove hardcoded admin password from `index.html`
- [ ] Remove hardcoded Cloudinary credentials from `index.html`
- [ ] Use environment variables in code
- [ ] Test authentication flow
- [ ] Deploy and verify

---

## 🚨 If Old Key is Already Compromised

1. **Regenerate Firebase Project** (safest option):
   - Create new Firebase project
   - Transfer data if needed
   - Update all credentials
   - Delete old project

2. **Or Restrict API Key**:
   - Go to Firebase Console → Project Settings → API Keys
   - Click on the key
   - Add HTTP Restrictions: restrict to your domain only
   - Add API Restrictions: only allow Firestore, Auth, Storage

---

## Contact for Security Issues

See SECURITY.md for vulnerability reporting process.
