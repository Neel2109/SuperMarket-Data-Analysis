# Firebase Database Study Document

## 1. Database Configuration Status

This project is configured to use Firebase Firestore.

The Firebase setup is present in:
- [firebase-applet-config.json](firebase-applet-config.json)
- [src/services/firebase.ts](src/services/firebase.ts)

The configuration contains:
- projectId
- apiKey
- authDomain
- storageBucket
- messagingSenderId
- appId
- firestoreDatabaseId

This means the app is prepared for Firebase connection.

## 2. Proof of Connection

The database is considered connected only if data can be written to it successfully.

In this project, the app writes to Firestore using functions such as:
- saveUserProjectInfo
- saveChatMessageToFirestore
- saveCustomUserTransaction

If these functions execute without errors and a document appears in Firestore, then the database is working.

If they fail, the project is only configured but not connected or not authorized.

### Example condition

- If saveUserProjectInfo or saveChatMessageToFirestore succeeds, then the database is connected.
- If a write fails with permission or network error, the database is not active or not properly configured.

## 3. Firestore Code Used in the Project

The app initializes Firebase and Firestore here:

```ts
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(
  app,
  firebaseConfigJson.firestoreDatabaseId || '(default)'
);
```

This code is present in [src/services/firebase.ts](src/services/firebase.ts).

The project also reads and writes Firestore data for:
- user profile settings
- chat history
- transaction records

## 4. Study Notes

The important files to study are:
1. [firebase-applet-config.json](firebase-applet-config.json) — Firebase project configuration
2. [src/services/firebase.ts](src/services/firebase.ts) — Firebase app, auth, and Firestore connections
3. [src/App.tsx](src/App.tsx) — how the app uses logged-in user data
4. [src/components/ChatDrawer.tsx](src/components/ChatDrawer.tsx) — how chat messages are saved
5. [src/services/gemini.ts](src/services/gemini.ts) — AI services working with project data

## 5. Final Conclusion

The project is configured for Firebase Firestore.

But the real test is this:
- if data can write to the database, then it is connected and working
- if data cannot write, then it is only configured in code and not yet usable

So the database status is:
- Configured: Yes
- Connected: Confirm only after a successful write operation
