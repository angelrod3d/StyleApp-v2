import React, { useState, useEffect } from 'react';
import { 
  Shirt, Trash2, Plus, X, LogOut, Search, 
  Grid, ShoppingBag, Footprints, Watch, Loader2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Your fixed, working Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAa70m48LmPidivmulGjSP_fURGjKDcbx8",
  authDomain: "stylespace-6de0c.firebaseapp.com",
  projectId: "stylespace-6de0c",
  storageBucket: "stylespace-6de0c.firebasestorage.app",
  messagingSenderId: "867973856017",
  appId: "1:867973856017:web:0ae847a9c2d163d9e8eab0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'stylespace';

const CATEGORIES = [
  { id: 'top', label: 'Tops', icon: Shirt },
  { id: 'bottom', label: 'Bottoms', icon: Grid },
  { id: 'shoes', label: 'Shoes', icon: Footprints },
  { id: 'accessory', label: 'Accessories', icon: Watch },
  { id: 'outerwear', label: 'Outerwear', icon: ShoppingBag }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [clothes, setClothes] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('closet');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('top');
  
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [newOutfitName, setNewOutfitName] = useState('');
  const [selectedItemsForOutfit, setSelectedItemsForOutfit] = useState([]);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    return onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.clothes) setClothes(data.clothes);
        if (data.outfits) setOutfits(data.outfits);
      }
    });
  }, [user]);

  const pushDataToCloud = async (field, data) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const ref = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
      await setDoc(ref, { [field]: data, lastBackup: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const next = [...clothes, { 
      id: Date.now().toString(), 
      name: newItemName, 
      category: newItemCategory 
    }];
    setClothes(next);
    pushDataToCloud('clothes', next);
    setNewItemName('');
    setShowAddModal(false);
  };

  const handleDeleteItem = (id) => {
    const next = clothes.filter(c => c.id !== id);
    setClothes(next);
    pushDataToCloud('clothes', next);
    // Also remove from outfits
    const updatedOutfits = outfits.map(o => ({
      ...o,
      items: o.items.filter(itemId => itemId !== id)
    }));
    setOutfits(updatedOutfits);
    pushDataToCloud('outfits', updatedOutfits);
  };

  const handleSaveOutfit = (e) => {
    e.preventDefault();
    if (!newOutfitName.trim() || selectedItemsForOutfit.length === 0) return;
    const next = [...outfits, { 
      id: Date.now().toString(), 
      name: newOutfitName, 
      items: selectedItemsForOutfit 
    }];
    setOutfits(next);
    pushDataToCloud('outfits', next);
    setNewOutfitName('');
    setSelectedItemsForOutfit([]);
    setShowOutfitModal(false);
  };

  const handleDeleteOutfit = (id) => {
    const next = outfits.filter(o => o.id !== id);
    setOutfits(next);
    pushDataToCloud('outfits', next);
  };

  const toggleOutfitItem = (id) => {
    if (selectedItemsForOutfit.includes(id)) {
      setSelectedItemsForOutfit(selectedItemsForOutfit.filter(i => i !== id));
    } else {
      setSelectedItemsForOutfit([...selectedItemsForOutfit, id]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-stone-800 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-stone-100 flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-stone-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg transform rotate-3">
            <Shirt size={40} />
          </div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">StyleSpace</h1>
          <p className="text-stone-500 mb-8 text-center text-lg">Your intelligent, connected wardrobe.</p>
          <button 
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} 
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-stone-200 p-4 rounded-xl shadow-sm hover:bg-stone-50 hover:border-stone-300 transition-all font-semibold text-lg"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const filteredClothes = clothes.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 shadow-sm border-b border-stone-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center shadow-md">
              <Shirt size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight leading-none">StyleSpace</h2>
              <p className="text-xs text-stone-500 font-medium flex items-center gap-2 mt-1">
                {user.displayName || 'User'}
                {isSyncing && <Loader2 size={12} className="animate-spin text-stone-400" />}
              </p>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)} 
            className="p-2.5 bg-stone-100 text-stone-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-6">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('closet')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${activeTab === 'closet' ? 'bg-stone-900 text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}
          >
            My Closet ({clothes.length})
          </button>
          <button 
            onClick={() => setActiveTab('outfits')}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${activeTab === 'outfits' ? 'bg-stone-900 text-white shadow-md' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}`}
          >
            Outfits ({outfits.length})
          </button>
        </div>

        {}
        {activeTab === 'closet' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search your wardrobe..." 
                  className="w-full bg-stone-50 pl-10 pr-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-2.5 rounded-xl hover:bg-stone-800 transition-colors font-semibold"
              >
                <Plus size={18} /> Add Item
              </button>
            </div>

            {filteredClothes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300 text-stone-500">
                <Shirt size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Your closet is looking empty.</p>
                <p className="text-sm">Click 'Add Item' to start building your digital wardrobe.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredClothes.map(item => {
                  const CatIcon = CATEGORIES.find(c => c.id === item.category)?.icon || Shirt;
                  return (
                    <div key={item.id} className="group bg-white p-5 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative overflow-hidden">
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="absolute top-3 right-3 p-2 bg-stone-100 text-stone-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-4 text-stone-700">
                        <CatIcon size={32} strokeWidth={1.5} />
                      </div>
                      <h3 className="font-semibold text-stone-800 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">{CATEGORIES.find(c => c.id === item.category)?.label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {}
        {activeTab === 'outfits' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-end bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <button 
                onClick={() => setShowOutfitModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-2.5 rounded-xl hover:bg-stone-800 transition-colors font-semibold"
              >
                <Plus size={18} /> Create Outfit
              </button>
            </div>

            {outfits.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300 text-stone-500">
                <Grid size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No outfits created yet.</p>
                <p className="text-sm">Combine your clothes to plan your perfect look.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outfits.map(outfit => (
                  <div key={outfit.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-stone-800">{outfit.name}</h3>
                      <button 
                        onClick={() => handleDeleteOutfit(outfit.id)}
                        className="p-2 bg-stone-50 text-stone-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {outfit.items.map(itemId => {
                        const item = clothes.find(c => c.id === itemId);
                        if (!item) return null;
                        const CatIcon = CATEGORIES.find(c => c.id === item.category)?.icon || Shirt;
                        return (
                          <div key={itemId} className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                            <CatIcon size={14} className="text-stone-500" />
                            <span className="text-sm font-medium text-stone-700">{item.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-800">Add to Closet</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-500"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-2">Item Name</label>
                <input 
                  autoFocus
                  type="text" 
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Vintage Blue Denim"
                  className="w-full bg-stone-50 px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewItemCategory(cat.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${newItemCategory === cat.id ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                    >
                      <cat.icon size={16} /> {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors mt-2">
                Save Item
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      {showOutfitModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-800">Create Outfit</h2>
              <button onClick={() => setShowOutfitModal(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-500"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveOutfit} className="flex flex-col flex-1 min-h-0">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-stone-600 mb-2">Outfit Name</label>
                <input 
                  autoFocus
                  type="text" 
                  required
                  value={newOutfitName}
                  onChange={(e) => setNewOutfitName(e.target.value)}
                  placeholder="e.g. Summer Picnic"
                  className="w-full bg-stone-50 px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
                />
              </div>

              <label className="block text-sm font-semibold text-stone-600 mb-2">Select Items</label>
              <div className="flex-1 overflow-y-auto min-h-[200px] border border-stone-200 rounded-xl p-2 space-y-1 mb-5 bg-stone-50">
                {clothes.length === 0 ? (
                  <p className="text-center text-stone-400 py-10">Add items to your closet first!</p>
                ) : (
                  clothes.map(item => {
                    const isSelected = selectedItemsForOutfit.includes(item.id);
                    const CatIcon = CATEGORIES.find(c => c.id === item.category)?.icon || Shirt;
                    return (
                      <div 
                        key={item.id}
                        onClick={() => toggleOutfitItem(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'}`}
                      >
                        <CatIcon size={18} className={isSelected ? 'text-stone-300' : 'text-stone-400'} />
                        <span className="font-medium flex-1">{item.name}</span>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    )
                  })
                )}
              </div>

              <button 
                type="submit" 
                disabled={selectedItemsForOutfit.length === 0 || !newOutfitName.trim()}
                className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Outfit ({selectedItemsForOutfit.length} items)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}