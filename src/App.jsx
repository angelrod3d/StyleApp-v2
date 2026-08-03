import React, { useState, useRef, useEffect } from 'react';
import { 
  Shirt, 
  Trash2, 
  Edit3, 
  Plus, 
  X,
  Download,
  Heart,
  Calendar,
  Sparkles,
  Layers,
  RotateCw,
  Maximize2,
  Minimize2,
  Repeat,
  Info,
  Check,
  Search,
  Filter,
  Eye,
  CalendarDays,
  Grid,
  ShoppingBag,
  BookOpen,
  Cloud,
  Copy,
  Upload,
  KeyRound,
  Columns2,
  Gem,
  Footprints,
  Watch,
  Flower2,
  Sun,
  Leaf,
  Snowflake,
  Infinity,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';

// Hardcoded explicit configuration for Netlify Deployment Reliability
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

const DEFAULT_CLOTHES = [
  { id: 't1', category: 'Tops', season: 'Summer', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80', favorite: true },
  { id: 't2', category: 'Tops', season: 'Autumn', imageUrl: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?auto=format&fit=crop&w=500&q=80', favorite: false },
  { id: 't3', category: 'Tops', season: 'Spring', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80', favorite: true },
  { id: 'b1', category: 'Bottoms', season: 'All-Year', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80', favorite: true },
  { id: 'b2', category: 'Bottoms', season: 'All-Year', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80', favorite: false },
  { id: 'b3', category: 'Bottoms', season: 'Summer', imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&q=80', favorite: false },
  { id: 'j1', category: 'Jackets', season: 'Autumn', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80', favorite: true },
  { id: 'j2', category: 'Jackets', season: 'Winter', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80', favorite: false },
  { id: 's1', category: 'Shoes', season: 'All-Year', imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80', favorite: true },
  { id: 's2', category: 'Shoes', season: 'Autumn', imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=500&q=80', favorite: false },
  { id: 'a1', category: 'Accessories', season: 'All-Year', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80', favorite: false },
  { id: 'a2', category: 'Accessories', season: 'All-Year', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80', favorite: true }
];

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Jackets'];
const OUTFIT_CATEGORIES = ['Casual', 'Workwear', 'Date Night', 'Weekend Calm', 'Cocktail Event', 'Activewear', 'Travel'];
const SEASONS = ['All', 'Spring', 'Summer', 'Autumn', 'Winter', 'All-Year'];

const DressIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 4c-1.5 0-3 2-3 2l-1 4h14l-1-4s-1.5-2-3-2M9 4v4m6-4v4M5 10l-2 11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1l-2-11" />
  </svg>
);

const JacketIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 10v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10" />
    <path d="M12 21V8" />
    <path d="M6 10l-3-2a2 2 0 0 1 0-3h18a2 2 0 0 1 0 3l-3 2" />
    <path d="M9 5l3 3 3-3" />
  </svg>
);

const CATEGORY_ICONS = { All: Grid, Tops: Shirt, Bottoms: Columns2, Dresses: DressIcon, Shoes: Footprints, Accessories: Watch, Jackets: JacketIcon };
const SEASON_ICONS = { All: Infinity, Spring: Flower2, Summer: Sun, Autumn: Leaf, Winter: Snowflake, 'All-Year': Infinity };

const PLANNER_DAYS = Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`);

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  const [activeTab, setActiveTab] = useState('items'); 

  // Cached state initializers for seamless offline/online transitions
  const [clothes, setClothes] = useState(() => {
    try {
      const cached = localStorage.getItem('stylespace_cached_clothes');
      return cached ? JSON.parse(cached) : DEFAULT_CLOTHES;
    } catch (e) {
      return DEFAULT_CLOTHES;
    }
  });

  const [outfits, setOutfits] = useState(() => {
    try {
      const cached = localStorage.getItem('stylespace_cached_outfits');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [weeklySchedule, setWeeklySchedule] = useState(() => {
    try {
      const cached = localStorage.getItem('stylespace_cached_schedule');
      if (cached) return JSON.parse(cached);
      const initial = {};
      PLANNER_DAYS.forEach(day => { initial[day] = null; });
      return initial;
    } catch (e) {
      const initial = {};
      PLANNER_DAYS.forEach(day => { initial[day] = null; });
      return initial;
    }
  });

  const [isCloudLoaded, setIsCloudLoaded] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [user, setUser] = useState(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('connecting'); // 'connecting' | 'synced' | 'error'

  const [currentOutfit, setCurrentOutfit] = useState({
    category: 'Casual',
    items: [
      { id: 'ci-1', baseId: 't1', category: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80', x: 50, y: 32, scale: 100, rotation: 0, zIndex: 1, isFlipped: false },
      { id: 'ci-2', baseId: 'b1', category: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80', x: 50, y: 68, scale: 100, rotation: 0, zIndex: 2, isFlipped: false }
    ]
  });

  const [editingOutfitId, setEditingOutfitId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [exportingOutfit, setExportingOutfit] = useState(null);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    const id = generateId();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => prev && prev.id === id ? null : prev);
    }, 3000);
  };

  // Keep local caches updated alongside database states
  useEffect(() => {
    localStorage.setItem('stylespace_cached_clothes', JSON.stringify(clothes));
  }, [clothes]);

  useEffect(() => {
    localStorage.setItem('stylespace_cached_outfits', JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem('stylespace_cached_schedule', JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);

  // 1. Auth Setup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Realtime Data Sync (Required Firebase Pattern)
  useEffect(() => {
    if (!user) return;
    
    setCloudSyncStatus('connecting');
    const profileDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    
    const loadCloudData = async () => {
      try {
        const snap = await getDoc(profileDocRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.clothes) setClothes(data.clothes);
          if (data.outfits) setOutfits(data.outfits);
          if (data.weeklySchedule) setWeeklySchedule(data.weeklySchedule);
        } else {
          // First time sync for this user
          await setDoc(profileDocRef, {
            clothes: clothes,
            outfits: outfits,
            weeklySchedule: weeklySchedule,
            lastBackup: new Date().toISOString()
          });
        }
        setCloudSyncStatus('synced');
        setIsCloudLoaded(true);
      } catch (err) {
        console.warn("Firestore listener error, switching to offline fallback mode:", err);
        setCloudSyncStatus('error');
      }
    };

    loadCloudData();
  }, [user]);

  const pushClothesToCloud = async (newClothes) => {
    setClothes(newClothes);
    if (!user) return;
    setCloudSyncStatus('connecting');
    const profileDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    try {
      await setDoc(profileDocRef, { clothes: newClothes }, { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      console.warn("Could not sync to cloud, data saved locally.");
      setCloudSyncStatus('error');
    }
  };

  const pushOutfitsToCloud = async (newOutfits) => {
    setOutfits(newOutfits);
    if (!user) return;
    setCloudSyncStatus('connecting');
    const profileDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    try {
      await setDoc(profileDocRef, { outfits: newOutfits }, { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      console.warn("Could not sync to cloud, data saved locally.");
      setCloudSyncStatus('error');
    }
  };

  const pushScheduleToCloud = async (newSchedule) => {
    setWeeklySchedule(newSchedule);
    if (!user) return;
    setCloudSyncStatus('connecting');
    const profileDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
    try {
      await setDoc(profileDocRef, { weeklySchedule: newSchedule }, { merge: true });
      setCloudSyncStatus('synced');
    } catch (err) {
      console.warn("Could not sync to cloud, data saved locally.");
      setCloudSyncStatus('error');
    }
  };

  const handleAddClothing = (newItemsPayload) => {
    const payloadsArray = Array.isArray(newItemsPayload) ? newItemsPayload : [newItemsPayload];
    const generatedItems = payloadsArray.map(payload => ({
      ...payload,
      id: generateId()
    }));
    const nextClothes = [...clothes, ...generatedItems];
    pushClothesToCloud(nextClothes);
    setIsAddModalOpen(false);
    triggerToast(`Successfully added ${generatedItems.length} new item${generatedItems.length > 1 ? 's' : ''} to your closet.`);
  };

  const handleUpdateClothing = (updatedItem) => {
    const nextClothes = clothes.map(c => c.id === updatedItem.id ? updatedItem : c);
    pushClothesToCloud(nextClothes);
    setEditingItem(null);
    setIsAddModalOpen(false);
    triggerToast('Updated item successfully.');
  };

  const handleDeleteClothing = (id) => {
    const nextClothes = clothes.filter(c => c.id !== id);
    pushClothesToCloud(nextClothes);

    const nextOutfit = {
      ...currentOutfit,
      items: (currentOutfit?.items || []).filter(item => item.baseId !== id)
    };
    setCurrentOutfit(nextOutfit);

    triggerToast('Removed item from your closet.', 'info');
  };

  const handleFavoriteClothingToggle = (id) => {
    const nextClothes = clothes.map(c => {
      if (c.id === id) {
        const nextState = !c.favorite;
        triggerToast(nextState ? 'Saved to favorites' : 'Removed from favorites', 'info');
        return { ...c, favorite: nextState };
      }
      return c;
    });
    pushClothesToCloud(nextClothes);
  };

  const handleSaveOutfit = () => {
    const items = currentOutfit?.items || [];
    if (items.length === 0) {
      triggerToast('Please add items to compose your outfit!', 'info');
      return;
    }

    let nextOutfits = [];
    if (editingOutfitId) {
      nextOutfits = outfits.map(o => o.id === editingOutfitId ? { ...currentOutfit, id: editingOutfitId } : o);
      triggerToast('Changes saved to your look!');
    } else {
      const newId = generateId();
      nextOutfits = [...outfits, { ...currentOutfit, id: newId, rating: 5, notes: 'Stitch look created on StyleSpace.' }];
      triggerToast('New look added to your collection!');
    }

    setEditingOutfitId(null);
    setCurrentOutfit({ category: 'Casual', items: [] });
    setActiveTab('collection');
    pushOutfitsToCloud(nextOutfits);
  };

  const handleStartCreateOutfit = () => {
    setCurrentOutfit({
      category: 'Casual',
      items: []
    });
    setEditingOutfitId(null);
    setActiveTab('create');
  };

  // Switch tabs & trigger a new blank outfit if Studio Canvas tab is clicked directly
  const handleTabChange = (tabId) => {
    if (tabId === 'create') {
      handleStartCreateOutfit();
    } else {
      setActiveTab(tabId);
    }
  };

  const handleDuplicateOutfit = (outfit) => {
    const duplicate = {
      ...outfit,
      id: generateId()
    };
    const nextOutfits = [...outfits, duplicate];
    pushOutfitsToCloud(nextOutfits);
    triggerToast('Look duplicated to your collection!');
  };

  const handleScheduleOutfit = (dayName, outfitId) => {
    const nextSchedule = { ...weeklySchedule, [dayName]: outfitId };
    pushScheduleToCloud(nextSchedule);
    triggerToast(`Look scheduled for ${dayName}!`);
  };

  const handleClearSchedule = (dayName) => {
    const nextSchedule = { ...weeklySchedule, [dayName]: null };
    pushScheduleToCloud(nextSchedule);
    triggerToast(`Cleared schedule for ${dayName}.`, 'info');
  };

  const handleExportSystemBackup = () => {
    const systemBackupData = {
      app: 'StyleSpace Core Backup',
      backupVersion: '3.2',
      exportTimestamp: new Date().toISOString(),
      accountSyncId: user?.uid || 'offline',
      clothes,
      outfits,
      weeklySchedule
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(systemBackupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `stylespace-full-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("Offline file backup created successfully!");
  };

  const handleImportSystemBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.app === 'StyleSpace Core Backup' && parsed.clothes) {
          pushClothesToCloud(parsed.clothes);
          pushOutfitsToCloud(parsed.outfits || []);
          pushScheduleToCloud(parsed.weeklySchedule || {});
          triggerToast("All backup configurations restored!", "success");
        } else {
          triggerToast("Invalid StyleSpace backup structure.", "error");
        }
      } catch (err) {
        triggerToast("Failed to parse the backup file.", "error");
      }
    };
    reader.readAsText(file);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center space-y-6">
          <div className="bg-stone-900 p-4 rounded-3xl text-stone-50 shadow-md">
            <Shirt size={48} className="stroke-[2]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-2">StyleSpace</h1>
            <p className="text-xs tracking-widest text-stone-500 uppercase font-bold">Capsule Moodboard & Diary</p>
          </div>
          <button
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="w-full flex items-center justify-center gap-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-900 px-6 py-4 rounded-2xl font-bold transition-all shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      
      {/* Toast Portal */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-stone-900 text-stone-100 px-5 py-4 rounded-2xl shadow-2xl border border-stone-800 transition-all animate-bounce">
          <div className="bg-amber-500 rounded-full p-1 text-stone-900">
            <Sparkles size={16} />
          </div>
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Elegant Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-stone-950 p-2.5 rounded-2xl text-stone-50 shadow-md flex items-center justify-center">
                <Shirt size={22} className="stroke-[2]" />
              </div>
              <div>
                <h1 className="font-extrabold text-2xl tracking-tight text-stone-900">StyleSpace</h1>
                <p className="text-[10px] tracking-widest text-stone-400 uppercase font-semibold">Capsule Moodboard & Diary</p>
              </div>
            </div>

            {/* Live Sync Badge & Logout */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSyncModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-full text-[10px] font-bold transition-all text-stone-700 font-sans"
              >
                {cloudSyncStatus === 'synced' && (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Cloud Active</span>
                  </>
                )}
                {cloudSyncStatus === 'connecting' && (
                  <>
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Connecting...</span>
                  </>
                )}
                {cloudSyncStatus === 'error' && (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Offline</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => signOut(auth)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-full text-[10px] font-bold transition-all text-rose-600 font-sans"
                title="Sign Out"
              >
                <KeyRound size={12}/> Sign Out
              </button>
            </div>
          </div>
          
          {/* Header tabs with ONLY icons (minimalist look) with hover tooltips */}
          <nav className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200/50 max-w-full overflow-x-auto scrollbar-none gap-1">
            {[
              { id: 'items', label: 'Wardrobe', icon: Shirt },
              { id: 'create', label: 'Studio Canvas', icon: Sparkles },
              { id: 'collection', label: 'My Looks', icon: BookOpen },
              { id: 'calendar', label: 'Planner (15 Days)', icon: CalendarDays }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  title={tab.label}
                  className={`flex items-center justify-center p-3 rounded-xl transition-all flex-shrink-0 relative group ${
                    active
                      ? 'bg-white text-stone-950 shadow-sm border border-stone-200'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-amber-500' : ''} />
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:block bg-stone-900 text-white text-[10px] py-1 px-2 rounded-lg shadow-lg whitespace-nowrap z-50 font-bold">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Primary Workspace container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <div className="transition-opacity duration-300">
          {activeTab === 'items' && (
            <ClothingItemsTab 
              clothes={clothes} 
              onAdd={() => { setEditingItem(null); setIsAddModalOpen(true); }}
              onDelete={handleDeleteClothing} 
              onEdit={(item) => { setEditingItem(item); setIsAddModalOpen(true); }}
              onToggleFavorite={handleFavoriteClothingToggle}
              onComposeFromScratch={handleStartCreateOutfit}
              triggerToast={triggerToast}
              onOpenSyncSettings={() => setIsSyncModalOpen(true)}
            />
          )}
          
          {activeTab === 'create' && (
            <CreateOutfitTab 
              clothes={clothes} 
              currentOutfit={currentOutfit} 
              setCurrentOutfit={setCurrentOutfit} 
              onSave={handleSaveOutfit} 
              isEditing={!!editingOutfitId}
              triggerToast={triggerToast}
              onBackToGallery={() => handleTabChange('collection')}
            />
          )}
          
          {activeTab === 'collection' && (
            <OutfitCollectionTab 
              outfits={outfits} 
              onEdit={(o) => { 
                setCurrentOutfit({
                  ...o,
                  items: o.items || []
                }); 
                setEditingOutfitId(o.id); 
                setActiveTab('create'); 
                triggerToast("Loaded outfit configuration into studio canvas.", "info");
              }} 
              onDelete={(id) => {
                const updatedOutfits = outfits.filter(o => o.id !== id);
                pushOutfitsToCloud(updatedOutfits);
                
                const updatedSchedule = { ...weeklySchedule };
                Object.keys(updatedSchedule).forEach(day => {
                  if (updatedSchedule[day] === id) updatedSchedule[day] = null;
                });
                pushScheduleToCloud(updatedSchedule);
                
                triggerToast("Deleted look from collection.", "info");
              }} 
              onDuplicate={handleDuplicateOutfit}
              onExportOutfit={(outfit) => setExportingOutfit(outfit)}
              onOpenCanvas={handleStartCreateOutfit}
              weeklySchedule={weeklySchedule}
              onSchedule={handleScheduleOutfit}
            />
          )}

          {activeTab === 'calendar' && (
            <OutfitCalendarTab 
              weeklySchedule={weeklySchedule}
              outfits={outfits}
              onClearDay={handleClearSchedule}
              onAssignDay={handleScheduleOutfit}
              triggerToast={triggerToast}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10 mt-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-2 rounded-xl text-stone-950">
              <Shirt size={16} />
            </div>
            <span className="font-bold tracking-tight text-white">StyleSpace Studio</span>
          </div>
          <p className="text-xs text-stone-500 font-sans">
            © 2026 StyleSpace. Cross-device smartphone and tablet sync. Fluid layout staging.
          </p>
          <div className="flex gap-4 text-xs font-sans">
            <button 
              onClick={() => setIsSyncModalOpen(true)}
              className="text-stone-400 hover:text-white transition-colors flex items-center gap-1 font-bold"
            >
              <Cloud size={12} /> Backup & Sync Center
            </button>
          </div>
        </div>
      </footer>

      {/* Overlays & Modals */}
      {isAddModalOpen && (
        <AddItemModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddClothing} 
          onUpdate={handleUpdateClothing} 
          itemToEdit={editingItem} 
        />
      )}

      {exportingOutfit && (
        <ExportLookbookModal 
          outfit={exportingOutfit} 
          onClose={() => setExportingOutfit(null)} 
          triggerToast={triggerToast}
        />
      )}

      {isSyncModalOpen && (
        <SyncCenterModal 
          currentSyncId={user?.uid}
          onClose={() => setIsSyncModalOpen(false)}
          onExportBackup={handleExportSystemBackup}
          onImportBackup={handleImportSystemBackup}
          triggerToast={triggerToast}
          cloudStatus={cloudSyncStatus}
        />
      )}
    </div>
  );
}

function ClothingItemsTab({ clothes, onAdd, onDelete, onEdit, onToggleFavorite, onComposeFromScratch, triggerToast, onOpenSyncSettings }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSeason('All');
    setShowOnlyFavorites(false);
    triggerToast("Closet filters reset", "info");
  };

  const filteredClothes = clothes.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSeason = selectedSeason === 'All' || item.season === selectedSeason;
    const matchesFavorite = !showOnlyFavorites || item.favorite;
    return matchesCategory && matchesSeason && matchesFavorite;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Restored Visual Header Banner containing the "Add Item" button */}
      <div className="bg-stone-900 rounded-2xl p-4 text-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-stone-800 rounded-full blur-3xl opacity-40 -z-10 translate-x-20 -translate-y-20"></div>
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 text-[10px] font-semibold">
            <Sparkles size={11} /> Active Cloud Closet Profile
          </div>
          <h2 className="text-xl font-extrabold tracking-tight font-sans">Virtual Wardrobe</h2>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto font-sans">
          <button
            onClick={onOpenSyncSettings}
            className="flex-grow sm:flex-none px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-all shadow-sm"
          >
            <Cloud size={12} /> Backups & Devices
          </button>
          <button
            onClick={onComposeFromScratch}
            className="flex-grow sm:flex-none px-3 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-all shadow-sm"
          >
            <Sparkles size={12} /> Studio Canvas
          </button>
          <button
            onClick={onAdd}
            className="flex-grow sm:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-lg hover:scale-[1.02]"
          >
            <Plus size={13} className="stroke-[3]" /> Add Items
          </button>
        </div>
      </div>

      {/* Compact Wardrobe Filter Console */}
      <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-sm space-y-3 font-sans max-w-full">
        <div className="flex flex-wrap gap-2 justify-between items-center pb-1">
          <span className="text-[11px] font-extrabold tracking-wider text-stone-500 uppercase">Capsule Filters</span>
          
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => {
                setShowOnlyFavorites(!showOnlyFavorites);
                triggerToast(showOnlyFavorites ? "Showing all wardrobe items" : "Showing favorites list", "info");
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-all border ${
                showOnlyFavorites
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600'
              }`}
            >
              <Heart size={11} className={showOnlyFavorites ? 'fill-rose-500 stroke-rose-600' : ''} />
              Favorites Only
            </button>

            <button
              onClick={handleResetFilters}
              className="text-[10px] text-stone-500 hover:text-stone-900 font-medium px-2 py-1 border border-transparent hover:border-stone-200 rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 w-14 shrink-0">Category</span>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(cat => {
                const IconComponent = CATEGORY_ICONS[cat] || Shirt;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    title={`Category: ${cat}`}
                    className={`p-2 rounded-xl transition-all border relative group ${
                      selectedCategory === cat
                        ? 'bg-black text-white border-black scale-110 shadow-md ring-2 ring-black/10'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200 hover:text-black'
                    }`}
                  >
                    <IconComponent size={14} />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-stone-950 text-white text-[9px] py-0.5 px-1.5 rounded shadow-lg whitespace-nowrap z-50 font-extrabold">
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 w-14 shrink-0">Season</span>
            <div className="flex gap-1.5 flex-wrap">
              {SEASONS.map(season => {
                const IconComponent = SEASON_ICONS[season] || Infinity;
                return (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    title={`Season: ${season}`}
                    className={`p-2 rounded-xl transition-all border relative group ${
                      selectedSeason === season
                        ? 'bg-black text-white border-black scale-110 shadow-md ring-2 ring-black/10'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200 hover:text-black'
                    }`}
                  >
                    <IconComponent size={14} />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-stone-950 text-white text-[9px] py-0.5 px-1.5 rounded shadow-lg whitespace-nowrap z-50 font-extrabold">
                      {season}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Wardrobe Items Display Area */}
      {filteredClothes.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-4 shadow-sm font-sans">
          <div className="bg-stone-100 text-stone-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Filter size={24} />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-stone-800">No clothes match your selection</h3>
            <p className="text-xs text-stone-500">
              Try choosing alternative filters, or add your first bespoke clothing piece!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in font-sans">
          {CATEGORIES.filter(c => c !== 'All').map(cat => {
            const items = filteredClothes.filter(c => c.category === cat);
            if (items.length === 0) return null;
            
            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-1.5">
                  <h3 className="font-extrabold text-stone-900 text-xs tracking-wider uppercase">{cat}</h3>
                  <span className="bg-stone-100 text-stone-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="group bg-white rounded-lg shadow-sm hover:shadow-md border border-stone-200 p-1 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-1 left-1 z-10 flex gap-0.5">
                        <button
                          onClick={() => onToggleFavorite(item.id)}
                          className="p-1 rounded-md bg-white/95 backdrop-blur-sm border border-stone-200 hover:bg-stone-50 shadow-sm transition-all"
                        >
                          <Heart
                            size={9}
                            className={item.favorite ? 'fill-rose-500 stroke-rose-500 scale-105' : 'text-stone-400 hover:text-rose-500'}
                          />
                        </button>
                      </div>

                      <div className="absolute top-1 right-1 z-10 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 rounded-md bg-white border border-stone-200 text-stone-600 hover:text-stone-900 shadow-sm transition-all"
                        >
                          <Edit3 size={8} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 rounded-md bg-white border border-stone-200 text-red-500 hover:bg-red-50 shadow-sm transition-all"
                        >
                          <Trash2 size={8} />
                        </button>
                      </div>

                      <div className="bg-stone-50 rounded-md overflow-hidden aspect-[4/5] border border-stone-100 group-hover:bg-stone-100/40 transition-colors flex items-center justify-center p-0.5">
                        <img
                          src={item.imageUrl}
                          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                          alt={item.category}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CreateOutfitTab({ clothes, currentOutfit, setCurrentOutfit, onSave, isEditing, triggerToast, onBackToGallery }) {
  const canvasRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [selectedCanvasItemId, setSelectedCanvasItemId] = useState(null);
  const [clothingCategoryFilter, setClothingCategoryFilter] = useState('All');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;
        if (selectedCanvasItemId) {
          handleRemoveCanvasItem(selectedCanvasItemId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCanvasItemId, currentOutfit]);

  const handleAddToCanvas = (clothingPiece) => {
    const uniqueCanvasId = `ci-${generateId()}`;
    const newItem = {
      id: uniqueCanvasId,
      baseId: clothingPiece.id,
      category: clothingPiece.category,
      imageUrl: clothingPiece.imageUrl,
      x: 50,
      y: 50,
      scale: 100,
      rotation: 0,
      zIndex: ((currentOutfit?.items || []).length || 0) + 1,
      isFlipped: false
    };

    setCurrentOutfit(prev => ({
      ...prev,
      items: [...(prev?.items || []), newItem]
    }));
    setSelectedCanvasItemId(uniqueCanvasId);
    triggerToast(`Added ${clothingPiece.category} item to styling canvas.`);
  };

  const handlePointerDown = (e, item) => {
    e.stopPropagation();
    
    setSelectedCanvasItemId(item.id);
    setDragState({
      type: 'item',
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      originalX: item.x,
      originalY: item.y
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMoveGlobal = (e) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const dX = ((e.clientX - dragState.startX) / rect.width) * 100;
      const dY = ((e.clientY - dragState.startY) / rect.height) * 100;
  
      const nextX = Math.max(-10, Math.min(110, dragState.originalX + dX));
      const nextY = Math.max(-10, Math.min(110, dragState.originalY + dY));
  
      if (dragState.type === 'item') {
        setCurrentOutfit(prev => ({
          ...prev,
          items: (prev?.items || []).map(it => it.id === dragState.id ? { ...it, x: nextX, y: nextY } : it)
        }));
      }
    };

    const handlePointerUpGlobal = () => {
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMoveGlobal);
    window.addEventListener('pointerup', handlePointerUpGlobal);
    window.addEventListener('touchend', handlePointerUpGlobal);

    return () => {
      window.removeEventListener('pointermove', handlePointerMoveGlobal);
      window.removeEventListener('pointerup', handlePointerUpGlobal);
      window.removeEventListener('touchend', handlePointerUpGlobal);
    };
  }, [dragState, setCurrentOutfit]);

  const handleUpdateItemProperty = (id, prop, value) => {
    setCurrentOutfit(prev => ({
      ...prev,
      items: (prev?.items || []).map(it => it.id === id ? { ...it, [prop]: value } : it)
    }));
  };

  const handleRemoveCanvasItem = (id) => {
    setCurrentOutfit(prev => ({
      ...prev,
      items: (prev?.items || []).filter(it => it.id !== id)
    }));
    setSelectedCanvasItemId(null);
  };

  const handleClearCanvas = () => {
    setCurrentOutfit(prev => ({ ...prev, items: [] }));
    setSelectedCanvasItemId(null);
  };

  const handleAutoAlign = () => {
    if (!currentOutfit?.items || currentOutfit.items.length === 0) return;
    const spacing = 100 / (currentOutfit.items.length + 1);
    const alignedItems = currentOutfit.items.map((it, idx) => ({
      ...it,
      x: 50,
      y: Math.round(spacing * (idx + 1)),
      scale: 100,
      rotation: 0
    }));
    setCurrentOutfit(prev => ({ ...prev, items: alignedItems }));
    triggerToast('Aligned items in clean sequence layout.');
  };

  const activeSelectedItem = currentOutfit?.items?.find(it => it.id === selectedCanvasItemId);
  const panelFilteredClothes = clothes.filter(c => clothingCategoryFilter === 'All' || c.category === clothingCategoryFilter);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="bg-white border border-stone-200 rounded-2xl p-3.5 flex flex-col md:flex-row justify-between items-center gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToGallery}
            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors text-stone-500 hover:text-stone-900"
          >
            <X size={14} />
          </button>
          <h2 className="text-base font-bold text-stone-900">Studio Canvas</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-3xl p-5 flex flex-col max-h-[700px] shadow-sm">
          <div className="border-b border-stone-100 pb-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm tracking-tight text-stone-900 flex items-center gap-1.5">
                <ShoppingBag size={16} /> Wardrobe Drawer
              </h3>
              <span className="text-[10px] text-stone-400 font-bold bg-stone-100 px-2 py-0.5 rounded-full">
                Interactive Grid
              </span>
            </div>
            
            <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setClothingCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                    clothingCategoryFilter === cat
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto py-3 scrollbar-thin min-h-[250px] flex-grow">
            {panelFilteredClothes.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs font-bold text-stone-400">Drawer empty</p>
                <p className="text-[10px] text-stone-500">Please add items in your main closet Wardrobe tab!</p>
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-1">
                {panelFilteredClothes.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleAddToCanvas(item)}
                    className="group cursor-pointer bg-stone-50 hover:bg-stone-100/70 border border-stone-200 p-1 rounded-lg flex flex-col items-center justify-center aspect-square relative transition-all duration-300 shadow-sm"
                    title={item.category}
                  >
                    <Plus size={8} className="absolute top-1 right-1 text-stone-400 group-hover:text-amber-600" />
                    <img src={item.imageUrl} className="max-h-[90%] max-w-[90%] object-contain mix-blend-multiply pointer-events-none" alt={item.category} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
          <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-stone-100">
            <span className="text-xs font-extrabold text-stone-400">LAYOUT WORKSPACE</span>
            <div className="flex gap-1.5">
              <button onClick={handleAutoAlign} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold text-stone-600 transition-all flex items-center gap-1"><Layers size={12} /> Align</button>
              <button onClick={handleClearCanvas} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold text-red-600 transition-all flex items-center gap-1"><Trash2 size={12} /> Reset</button>
            </div>
          </div>

          <div
            ref={canvasRef}
            onClick={() => { setSelectedCanvasItemId(null); }}
            className="w-full max-w-[340px] aspect-[4/5] rounded-2xl relative overflow-hidden shadow-inner border border-stone-200 transition-all bg-stone-100/50"
          >
            {(!currentOutfit?.items || currentOutfit.items.length === 0) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-2 pointer-events-none">
                <Plus size={24} className="text-stone-300 animate-pulse" />
                <p className="text-sm font-bold text-stone-700">Canvas Blank</p>
                <p className="text-xs text-stone-400 leading-relaxed">Tap items inside the wardrobe drawer to lay them onto this styling canvas.</p>
              </div>
            )}

            {(currentOutfit?.items || []).map((item) => {
              const isSelected = item.id === selectedCanvasItemId;
              return (
                <div 
                  key={item.id} 
                  onPointerDown={(e) => handlePointerDown(e, item)}
                  onClick={(e) => { e.stopPropagation(); setSelectedCanvasItemId(item.id); }}
                  className={`absolute cursor-move touch-none select-none ${isSelected ? 'z-[100]' : ''}`}
                  style={{
                    left: `${item.x}%`, 
                    top: `${item.y}%`, 
                    zIndex: isSelected ? 100 : item.zIndex || 1,
                    transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg) scale(${(item.scale || 100) / 100}) ${item.isFlipped ? 'scaleX(-1)' : ''}`,
                    width: '42%'
                  }}
                >
                  <div className={`relative p-2 rounded-2xl transition-all ${isSelected ? 'ring-2 ring-dashed ring-amber-500 bg-white/60 shadow-xl' : 'hover:bg-white/10'}`}>
                    <img src={item.imageUrl} className="w-full object-contain mix-blend-multiply pointer-events-none" alt="" draggable="false" />
                    {isSelected && (
                      <button 
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); handleRemoveCanvasItem(item.id); }} 
                        className="absolute -top-2.5 -right-2.5 bg-stone-900 text-white rounded-full p-1.5 border border-stone-800 shadow-md"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full max-w-[340px] mt-5 pt-4 border-t border-stone-100 flex flex-col gap-2">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider pl-1">Finalize & Save</span>
            <div className="flex items-stretch gap-2 w-full">
              <select
                value={currentOutfit?.category || 'Casual'}
                onChange={(e) => setCurrentOutfit(prev => ({ ...prev, category: e.target.value }))}
                className="flex-grow px-3 py-2.5 border border-stone-200 bg-stone-50 text-stone-800 rounded-xl text-xs font-bold outline-none cursor-pointer"
              >
                {OUTFIT_CATEGORIES.map(vibe => (
                  <option key={vibe} value={vibe}>{vibe}</option>
                ))}
              </select>

              <button
                onClick={onSave}
                className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Check size={14} className="stroke-[3]" />
                Save Look
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 font-sans">
          <TransformInspectorPanel 
            activeItem={activeSelectedItem} 
            onUpdateItemProp={handleUpdateItemProperty}
            onBringForward={(item) => {
              const currentMax = Math.max(...(currentOutfit?.items || []).map(it => it.zIndex || 1), 1);
              handleUpdateItemProperty(item.id, 'zIndex', currentMax + 1);
            }}
            onSendBackward={(item) => {
              const currentMin = Math.min(...(currentOutfit?.items || []).map(it => it.zIndex || 1), 1);
              handleUpdateItemProperty(item.id, 'zIndex', Math.max(1, currentMin - 1));
            }}
          />
        </div>
      </div>
    </div>
  );
}

function TransformInspectorPanel({ 
  activeItem, 
  onUpdateItemProp, 
  onBringForward, 
  onSendBackward 
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-5 space-y-6 h-full shadow-sm flex flex-col justify-between">
      <div className="flex-grow flex flex-col justify-center space-y-4">
        {activeItem ? (
          <div className="space-y-4">
            <h5 className="font-extrabold text-sm text-stone-900 truncate">Modify: {activeItem.category}</h5>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>Scale</span>
                <span>{activeItem.scale || 100}%</span>
              </div>
              <input type="range" min="30" max="160" value={activeItem.scale || 100} onChange={(e) => onUpdateItemProp(activeItem.id, 'scale', parseInt(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>Angle</span>
                <span>{activeItem.rotation || 0}°</span>
              </div>
              <input type="range" min="-180" max="180" value={activeItem.rotation || 0} onChange={(e) => onUpdateItemProp(activeItem.id, 'rotation', parseInt(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={() => onUpdateItemProp(activeItem.id, 'isFlipped', !activeItem.isFlipped)} className="flex items-center justify-center gap-1.5 px-3 py-2.5 border rounded-xl text-xs font-bold">Flip Horizontal</button>
              <button onClick={() => onBringForward(activeItem)} className="px-3 py-2.5 border rounded-xl text-xs font-bold">Bring Front</button>
              <button onClick={() => onSendBackward(activeItem)} className="px-3 py-2.5 border rounded-xl text-xs font-bold col-span-2">Send Back</button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 space-y-2 border border-dashed rounded-2xl p-4">
            <Layers size={18} className="mx-auto text-stone-400" />
            <p className="text-xs font-bold">Canvas Inspector</p>
            <p className="text-[11px] text-stone-500 leading-relaxed">Select any layout piece on your styling canvas to unlock scales, rotation, layering, and flips.</p>
          </div>
        )}
      </div>

      <div className="text-xs text-stone-400 p-3 bg-stone-50 rounded-xl leading-normal">
        Hold and drag items on the canvas preview to stack, align and organize your look.
      </div>
    </div>
  );
}

function OutfitCollectionTab({ outfits, onEdit, onDelete, onDuplicate, onExportOutfit, onOpenCanvas, weeklySchedule, onSchedule }) {
  const [filter, setFilter] = useState('All');
  const [schedulerTarget, setSchedulerTarget] = useState(null);

  const filtered = filter === 'All' ? outfits : outfits.filter(o => o.category === filter);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-950 tracking-tight">Style Book</h2>
          <p className="text-xs text-stone-500">Curate and deploy your saved layered looks.</p>
        </div>
        <button onClick={onOpenCanvas} className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow transition-all hover:scale-[1.01]">
          <Plus size={15} className="stroke-[3]" /> Launch Canvas
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1.5 border-b border-stone-200 scrollbar-none">
        {['All', ...OUTFIT_CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${filter === c ? 'bg-stone-950 text-stone-50 shadow-sm' : 'bg-white border border-stone-200 text-stone-600'}`}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <BookOpen size={24} className="mx-auto text-stone-400" />
          <h3 className="text-base font-bold">No looks matching "{filter}"</h3>
          <p className="text-xs text-stone-500">Go to Studio Canvas to start designing custom looks!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
          {filtered.map(outfit => {
            return (
              <div key={outfit.id} className="group bg-white rounded-2xl border border-stone-200 p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-full aspect-[4/5] rounded-xl relative overflow-hidden border border-stone-100 mb-3 bg-stone-50/55">
                    <div className="absolute inset-0 scale-150">
                      {(outfit.items || []).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.imageUrl}
                          className="absolute object-contain mix-blend-multiply"
                          style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            width: '38%',
                            transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg) scale(${(item.scale || 100) / 100}) ${item.isFlipped ? 'scaleX(-1)' : ''}`,
                            zIndex: item.zIndex || 1
                          }}
                          alt=""
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg font-bold">{outfit.category}</span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-2 mt-3 flex items-center justify-between">
                  <div className="relative">
                    <button onClick={() => setSchedulerTarget(prev => prev === outfit.id ? null : outfit.id)} className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 flex items-center transition-all">
                      <Calendar size={12} />
                    </button>

                    {schedulerTarget === outfit.id && (
                      <div className="absolute bottom-full left-0 mb-2.5 z-30 bg-white border border-stone-200 rounded-2xl shadow-2xl p-2 w-48 max-h-56 overflow-y-auto space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-stone-400 px-2 py-1.5 block">Plan look to:</span>
                        {PLANNER_DAYS.map(day => (
                          <button
                            key={day}
                            onClick={() => { onSchedule(day, outfit.id); setSchedulerTarget(null); }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex justify-between items-center ${Object.keys(weeklySchedule).some(k => weeklySchedule[k] === outfit.id && k === day) ? 'bg-amber-50 text-amber-800 font-bold' : 'hover:bg-stone-50 text-stone-600'}`}
                          >
                            <span>{day}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <button onClick={() => onExportOutfit(outfit)} className="p-1.5 text-stone-500 hover:text-stone-950 transition-colors"><Eye size={14} /></button>
                    <button onClick={() => onEdit(outfit)} className="p-1.5 text-stone-500 hover:text-indigo-600 transition-colors"><Edit3 size={14} /></button>
                    <button onClick={() => onDuplicate(outfit)} className="p-1.5 text-stone-500 hover:text-emerald-600 transition-colors"><Plus size={14} /></button>
                    <button onClick={() => onDelete(outfit.id)} className="p-1.5 text-red-500 hover:text-red-700 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OutfitCalendarTab({ weeklySchedule, outfits, onClearDay, onAssignDay, triggerToast, setActiveTab }) {
  const [activeDayAssign, setActiveDayAssign] = useState(null);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <Calendar size={22} className="text-amber-500" /> Long-Range Capsule Diary (15 Days)
            </h2>
            <p className="text-xs text-stone-500">
              Schedule your curated canvas compositions in sequential columns for precise style planning.
            </p>
          </div>
          <button onClick={() => setActiveTab('collection')} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all">
            Browse Saved Looks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 animate-fade-in">
        {PLANNER_DAYS.map(day => {
          const outfitId = weeklySchedule[day];
          const scheduledOutfit = outfits.find(o => o.id === outfitId);

          return (
            <div
              key={day}
              className={`bg-white border rounded-2xl p-3 flex flex-col justify-between shadow-sm relative transition-all duration-300 min-h-[190px] ${scheduledOutfit ? 'border-amber-500/40 ring-1 ring-amber-500/10' : 'border-stone-200 hover:border-stone-300'}`}
            >
              <div className="border-b border-stone-100 pb-2 mb-2 flex justify-between items-center">
                <span className="font-extrabold text-xs text-stone-900 tracking-tight">{day}</span>
                {scheduledOutfit && (
                  <button onClick={(e) => { e.stopPropagation(); onClearDay(day); }} className="p-1 rounded hover:text-stone-900 hover:bg-stone-100 flex-shrink-0 z-10 relative">
                    <X size={12} />
                  </button>
                )}
              </div>

              {scheduledOutfit ? (
                <div 
                  onClick={() => setActiveDayAssign(day)}
                  className="flex-grow flex flex-col justify-between space-y-2 font-sans cursor-pointer group"
                >
                  <div className="w-full max-w-32 mx-auto aspect-[4/5] rounded-xl relative overflow-hidden border border-stone-100 bg-stone-50/50 group-hover:border-amber-400 group-hover:shadow-md transition-all">
                    <div className="absolute inset-0 scale-150">
                      {(scheduledOutfit.items || []).slice(0, 3).map((item, i) => (
                        <img
                          key={i}
                          src={item.imageUrl}
                          className="absolute object-contain mix-blend-multiply"
                          style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            width: '38%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: item.zIndex || 1
                          }}
                          alt=""
                        />
                      ))}
                    </div>
                  </div>

                  <span className="block text-center text-[10px] bg-amber-500/10 text-amber-700 font-extrabold px-1.5 py-0.5 rounded-lg uppercase truncate group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">{scheduledOutfit.category}</span>
                </div>
              ) : (
                <div 
                  onClick={() => setActiveDayAssign(day)}
                  className="flex-grow flex flex-col items-center justify-center py-6 text-center cursor-pointer group hover:bg-stone-50 rounded-xl transition-all"
                >
                  <Plus size={16} className="text-stone-300 group-hover:text-amber-500 group-hover:scale-110 transition-all" />
                  <p className="text-[10px] text-stone-400 mt-1 group-hover:text-stone-600 transition-colors">Tap to schedule</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeDayAssign && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3.5 mb-5 font-sans">
              <div className="flex items-center gap-2">
                <Calendar className="text-amber-500" size={18} />
                <h3 className="text-lg font-black text-stone-950">Schedule Look for {activeDayAssign}</h3>
              </div>
              <button onClick={() => setActiveDayAssign(null)} className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 transition-all"><X size={16} /></button>
            </div>
            
            <div className="overflow-y-auto flex-grow p-1 scrollbar-thin">
              {outfits.length === 0 ? (
                  <div className="text-center py-12 space-y-3 border-2 border-dashed border-stone-200 rounded-2xl">
                    <BookOpen size={24} className="mx-auto text-stone-300" />
                    <p className="text-sm font-bold text-stone-600">No looks available to schedule</p>
                    <button onClick={() => { setActiveDayAssign(null); setActiveTab('create'); }} className="px-5 py-2.5 bg-stone-950 text-white text-xs font-bold rounded-xl mt-2 transition-transform hover:scale-105">Go to Studio Canvas</button>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {outfits.map(outfit => (
                          <div 
                              key={outfit.id}
                              onClick={() => {
                                  onAssignDay(activeDayAssign, outfit.id);
                                  setActiveDayAssign(null);
                              }}
                              className="cursor-pointer group bg-white rounded-2xl border border-stone-200 p-3 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
                          >
                              <div className="w-full aspect-[4/5] rounded-xl relative overflow-hidden border border-stone-100 mb-3 bg-stone-50/55 group-hover:bg-amber-50/30 transition-colors">
                                <div className="absolute inset-0 scale-150">
                                  {(outfit.items || []).map((item, idx) => (
                                    <img
                                      key={idx}
                                      src={item.imageUrl}
                                      className="absolute object-contain mix-blend-multiply"
                                      style={{
                                        left: `${item.x}%`,
                                        top: `${item.y}%`,
                                        width: '38%',
                                        transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg) scale(${(item.scale || 100) / 100}) ${item.isFlipped ? 'scaleX(-1)' : ''}`,
                                        zIndex: item.zIndex || 1
                                      }}
                                      alt=""
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-center">
                                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg font-bold group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">{outfit.category}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SyncCenterModal({ currentSyncId, onClose, onExportBackup, onImportBackup, triggerToast, cloudStatus }) {
  const fileInputId = "stylespace-backup-file-picker";

  const handleCopyCode = () => {
    if (!currentSyncId) return;
    navigator.clipboard.writeText(currentSyncId);
    triggerToast("Sync Code copied to clipboard!", "success");
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3.5 mb-5 font-sans">
          <div className="flex items-center gap-2">
            <Cloud className="text-amber-500" size={18} />
            <h3 className="text-lg font-black text-stone-950">Backup & Device Sync</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 transition-all"><X size={16} /></button>
        </div>

        <div className="space-y-6 overflow-y-auto flex-grow pr-1 font-sans">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 block">Device Sync Code</span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-stone-500">Your unique sync profile identifier:</p>
                <p className="text-sm font-black text-stone-900 tracking-mono pt-1">
                  {currentSyncId ? currentSyncId.toUpperCase() : 'Generating...'}
                </p>
              </div>
              <button onClick={handleCopyCode} className="p-2 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl" title="Copy sync code">
                <Copy size={14} />
              </button>
            </div>
            <p className="text-[10px] text-stone-500 leading-normal pt-2 border-t border-stone-200">
              💡 The platform automatically syncs your wardrobe across devices when you are logged into your account. Keep this code safe as a backup identifier.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-stone-100 font-sans">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-stone-400 block">Offline Local Backups</span>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={onExportBackup} className="flex items-center justify-center gap-1.5 px-4 py-3 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700">
                <Download size={13} /> Export Backup
              </button>
              
              <label 
                htmlFor={fileInputId}
                className="flex items-center justify-center gap-1.5 px-4 py-3 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-700 cursor-pointer text-center"
              >
                <Upload size={13} /> Import Backup
              </label>
              <input 
                id={fileInputId}
                type="file" 
                onChange={(e) => {
                  onImportBackup(e);
                  e.target.value = ''; 
                }} 
                accept=".json" 
                className="hidden" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconPicker({ options, icons, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map(opt => {
        const Icon = icons[opt];
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border text-[9px] font-bold uppercase tracking-wide transition-all ${
              active
                ? 'bg-stone-950 text-stone-50 border-stone-950 shadow-md animate-pulse'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            <Icon size={18} className={active ? 'text-amber-400' : ''} />
            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function AddItemModal({ onClose, onAdd, onUpdate, itemToEdit }) {
  const [category, setCategory] = useState(itemToEdit ? itemToEdit.category : 'Tops');
  const [season, setSeason] = useState(itemToEdit ? itemToEdit.season : 'All-Year');
  
  const [images, setImages] = useState(itemToEdit ? [itemToEdit.imageUrl] : []);
  const imageInputId = "stylespace-image-uploader-input";

  const processFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const fileReadersPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReadersPromises).then(base64Images => {
      setImages(prev => [...prev, ...base64Images]);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleApplySampleUrl = (url) => {
    setImages(prev => [...prev, url]);
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      const fallbackUrl = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80';
      const singlePayload = {
        category,
        season,
        imageUrl: fallbackUrl,
        favorite: false
      };
      
      if (itemToEdit) {
        onUpdate({ ...singlePayload, id: itemToEdit.id });
      } else {
        onAdd(singlePayload);
      }
      return;
    }

    if (itemToEdit) {
      onUpdate({
        category,
        season,
        imageUrl: images[0],
        favorite: itemToEdit.favorite,
        id: itemToEdit.id
      });
    } else {
      const payloads = images.map(imgSrc => ({
        category,
        season,
        imageUrl: imgSrc,
        favorite: false
      }));
      onAdd(payloads); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] font-sans">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
          <h3 className="text-lg font-black text-stone-950">
            {itemToEdit ? 'Configure Wardrobe Piece' : 'Upload Wardrobe Pieces'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-4 pr-1">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
              {itemToEdit ? 'Garment Photo / Silhouette' : 'Garment Photos / Silhouettes (Multiple Supported)'}
            </label>
            
            <input 
              id={imageInputId}
              type="file" 
              multiple={!itemToEdit}
              onChange={(e) => {
                processFiles(e);
                e.target.value = '';
              }} 
              accept="image/*" 
              className="hidden" 
            />

            <label 
              htmlFor={imageInputId}
              className="cursor-pointer bg-stone-50 hover:bg-stone-100 border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl p-4 text-center min-h-[110px] flex flex-col items-center justify-center gap-1 block transition-all"
            >
              <Upload size={20} className="text-stone-400" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-stone-700">
                  {itemToEdit ? 'Select Image file' : 'Choose / Drag image files'}
                </p>
                <p className="text-[10px] text-stone-400">White backgrounds look best</p>
              </div>
            </label>

            {images.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                  Loaded Previews ({images.length})
                </span>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2 bg-stone-50 border border-stone-200/70 rounded-xl scrollbar-thin">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border border-stone-200 aspect-square bg-white flex items-center justify-center p-1.5">
                      <img src={imgUrl} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-all opacity-95 hover:scale-110"
                        title="Dismiss image"
                      >
                        <X size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {images.length === 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-bold text-stone-400 uppercase">Or select standard preset:</span>
                <div className="flex gap-2">
                  <button onClick={() => handleApplySampleUrl('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80')} className="text-[9px] border px-2.5 py-1.5 rounded-lg font-bold transition-all hover:bg-stone-50">White Tee</button>
                  <button onClick={() => handleApplySampleUrl('https://images.unsplash.com/photo-1574164904299-3a102b110380?auto=format&fit=crop&w=500&q=80')} className="text-[9px] border px-2.5 py-1.5 rounded-lg font-bold transition-all hover:bg-stone-50">Knit Sweater</button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Apply Category</label>
            <IconPicker options={CATEGORIES.filter(c => c !== 'All')} icons={CATEGORY_ICONS} value={category} onChange={setCategory} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Apply Ideal Season</label>
            <IconPicker options={SEASONS.filter(s => s !== 'All')} icons={SEASON_ICONS} value={season} onChange={setSeason} />
          </div>
        </div>

        <div className="border-t border-stone-100 pt-3.5 mt-4">
          <button 
            onClick={handleSubmit} 
            className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-stone-50 text-xs font-black tracking-wider rounded-xl shadow-md transition-all uppercase"
          >
            {itemToEdit 
              ? 'Save Changes' 
              : `Add ${images.length || 1} Item${images.length > 1 ? 's' : ''} to Wardrobe`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function ExportLookbookModal({ outfit, onClose, triggerToast }) {
  const [lookbookNotes, setLookbookNotes] = useState(outfit.notes || '');
  const [personalRating, setPersonalRating] = useState(outfit.rating || 5);

  const handleExportCard = () => {
    const exportData = {
      app: 'StyleSpace Premium',
      category: outfit.category,
      stylingNotes: lookbookNotes,
      outfitRating: personalRating,
      piecesUsed: (outfit.items || []).map(it => it.category || 'Wardrobe garment')
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${outfit.category.toLowerCase()}-lookbook-${outfit.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerToast(`Exported lookbook card successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl border border-stone-200 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto animate-fade-in font-sans">
        <div className="flex-1 space-y-3">
          <span className="text-[10px] tracking-widest font-extrabold text-stone-400 uppercase block">Polaroid View</span>
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl shadow-inner flex flex-col items-center">
            <div className="w-full aspect-[4/5] rounded-xl relative overflow-hidden border border-stone-200 bg-stone-100">
              {(outfit.items || []).map((item, idx) => (
                <img 
                  key={idx} 
                  src={item.imageUrl} 
                  className="absolute object-contain mix-blend-multiply" 
                  style={{
                    left: `${item.x}%`, 
                    top: `${item.y}%`, 
                    width: '38%',
                    transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg) scale(${(item.scale || 100) / 100}) ${item.isFlipped ? 'scaleX(-1)' : ''}`,
                    zIndex: item.zIndex || 1
                  }} 
                  alt="" 
                />
              ))}
            </div>
            <div className="w-full pt-4 text-center">
              <span className="font-serif italic text-sm text-stone-700">StyleSpace Editorial Match</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-4 font-sans">
          <div className="space-y-4">
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] bg-stone-100 font-bold text-stone-600 px-2 py-0.5 rounded uppercase">{outfit.category}</span>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg border border-stone-200"><X size={15} /></button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">Personal Outfit Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setPersonalRating(star)} className="text-lg transition-transform hover:scale-110">
                    <span className={star <= personalRating ? 'text-amber-500' : 'text-stone-200'}>★</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">Lookbook / Vibe Notes</label>
              <textarea 
                value={lookbookNotes}
                onChange={(e) => setLookbookNotes(e.target.value)}
                placeholder="Style reasons, ideal weather settings..."
                className="w-full bg-stone-50 border border-stone-200 text-xs p-3 rounded-xl outline-none min-h-[90px] resize-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-stone-100">
            <button onClick={handleExportCard} className="w-full py-3 bg-stone-950 text-stone-50 text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all hover:bg-stone-800">
              <Download size={13} /> Export Metadata Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}