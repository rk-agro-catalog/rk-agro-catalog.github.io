# Firestore Security Rules - Firebase Console में लगाओ

## कहाँ लगाना है:
1. https://console.firebase.google.com जाओ
2. **Firestore Database** click करो
3. **Rules** tab में जाओ
4. नीचे दिया गया code **replace** करो
5. **Publish** button दबाओ

---

## 📋 Copy-Paste करो (Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // सभी authenticated users को products देख सकते हैं
    match /products/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.email == "admin@nasit.com";
    }
    
    // Default - सब कुछ block है
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## क्या ये करेगा?

✅ **पढ़ सकता है**: कोई भी logged-in user  
✅ **Edit/Delete कर सकता है**: सिर्फ `admin@nasit.com`  
✅ **Anonymous users**: कुछ नहीं कर सकते  
✅ **Unauthorized edits**: Database खुद block करेगा

---

## ⏱️ बस 1 मिनट का काम है!
