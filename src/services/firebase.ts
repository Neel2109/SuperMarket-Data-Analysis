import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { ChatMessage, CollegeProjectInfo, SaleRecord } from '../types';

// Import configuration from provisioned file
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use custom provisioned database ID
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db = getFirestore(
  app,
  firebaseConfigJson.firestoreDatabaseId || '(default)'
);

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// User college project info persistence
export async function saveUserProjectInfo(userId: string, projectInfo: CollegeProjectInfo) {
  try {
    const userRef = doc(db, 'users', userId, 'settings', 'collegeProject');
    await setDoc(userRef, {
      ...projectInfo,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('Failed to save project info to Firestore:', e);
  }
}

export async function getUserProjectInfo(userId: string): Promise<CollegeProjectInfo | null> {
  try {
    const userRef = doc(db, 'users', userId, 'settings', 'collegeProject');
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as CollegeProjectInfo;
    }
  } catch (e) {
    console.warn('Failed to read project info from Firestore:', e);
  }
  return null;
}

// Chat history persistence
export async function saveChatMessageToFirestore(userId: string, message: ChatMessage) {
  try {
    const chatRef = collection(db, 'users', userId, 'chatHistory');
    await addDoc(chatRef, {
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      sources: message.sources || [],
      modelUsed: message.modelUsed || '',
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Failed to save chat message to Firestore:', e);
  }
}

export async function loadUserChatHistory(userId: string): Promise<ChatMessage[]> {
  try {
    const chatRef = collection(db, 'users', userId, 'chatHistory');
    const q = query(chatRef, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    const messages: ChatMessage[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      messages.push({
        id: data.id || docSnap.id,
        role: data.role,
        content: data.content,
        timestamp: data.timestamp || Date.now(),
        sources: data.sources || [],
        modelUsed: data.modelUsed,
      });
    });
    return messages;
  } catch (e) {
    console.warn('Failed to load chat history from Firestore:', e);
    return [];
  }
}

// User custom transactions persistence
export async function saveCustomUserTransaction(userId: string, transaction: SaleRecord) {
  try {
    const txRef = collection(db, 'users', userId, 'customTransactions');
    await addDoc(txRef, {
      ...transaction,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Failed to persist custom transaction to Firestore:', e);
  }
}
