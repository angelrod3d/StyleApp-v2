import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAa70m48LmPidivmulGjSP_fURGjKDcbx8',
  authDomain: 'stylespace-6de0c.firebaseapp.com',
  projectId: 'stylespace-6de0c',
  storageBucket: 'stylespace-6de0c.firebasestorage.app',
  messagingSenderId: '867973856017',
  appId: '1:867973856017:web:0ae847a9c2d163d9e8eab0',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [clothes, setClothes] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user || isSyncing) return;
    const ref = doc(db, 'stylespace', user.uid);
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) setClothes(snap.data().clothes || []);
    });
  }, [user, isSyncing]);

  const saveToCloud = async (newClothes) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await setDoc(
        doc(db, 'stylespace', user.uid),
        { clothes: newClothes },
        { merge: true }
      );
    } finally {
      setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  const addItem = () => {
    const next = [...clothes, { id: Date.now(), name: 'New Item' }];
    setClothes(next);
    saveToCloud(next);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded"
          onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">StyleSpace</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </button>
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={addItem}
      >
        Add Item
      </button>
      <div className="space-y-2">
        {clothes.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow-sm">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
