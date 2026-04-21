'use client';
import { useState, useEffect } from 'react';
import { Star, ClipboardList, Search, Landmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Masjid {
  _id: string;
  name: string;
  address: string;
}

export default function MasjidsPage() {
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyToggle, setNearbyToggle] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const router = useRouter();

  useEffect(() => {
    // Fetch masjids
    fetch('/api/masjids')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMasjids(data);
        }
      })
      .catch(err => console.error("Error fetching masjids:", err));
      
    // Load favorites from local storage
    const savedFavorites = localStorage.getItem('masjidFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {}
    }
  }, []);
  
  const toggleFavorite = (id: string) => {
    const newFavorites = { ...favorites, [id]: !favorites[id] };
    setFavorites(newFavorites);
    localStorage.setItem('masjidFavorites', JSON.stringify(newFavorites));
  };

  const filteredMasjids = masjids.filter(masjid => 
    masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    masjid.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#FAF8F1', minHeight: '100vh', padding: '6rem 1rem', fontFamily: 'inherit' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          Masjids in Vaniyambadi
        </h1>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <button style={{ background: 'var(--primary)', color: 'white', borderRadius: '2rem', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <Star size={18} fill="#ff4d4d" color="#ff4d4d"/> Favourites
          </button>
          <button style={{ background: 'var(--primary)', color: 'white', borderRadius: '2rem', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <ClipboardList size={18} /> Notice Board
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }}/>
          <input 
            type="text" 
            placeholder="Search for masjid by name or area" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '2rem', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Nearby Masjids</h3>
          <div 
            onClick={() => setNearbyToggle(!nearbyToggle)}
            style={{ 
              background: nearbyToggle ? '#4CAF50' : '#ddd', 
              borderRadius: '2rem', 
              padding: '0.2rem', 
              display: 'flex', 
              alignItems: 'center', 
              width: '60px', 
              justifyContent: nearbyToggle ? 'flex-end' : 'flex-start', 
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {nearbyToggle ? null : <div style={{ background: 'white', borderRadius: '50%', width: '24px', height: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>}
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', margin: nearbyToggle ? '0 4px 0 0' : '0 0 0 4px', color: nearbyToggle ? 'white' : '#333' }}>
              {nearbyToggle ? 'ON' : 'OFF'}
            </span>
            {nearbyToggle ? <div style={{ background: 'white', borderRadius: '50%', width: '24px', height: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div> : null}
          </div>
        </div>

        <div>
          {filteredMasjids.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>Searching or no masjids found...</p>
          ) : (
            filteredMasjids.map((masjid) => (
              <div 
                key={masjid._id} 
                onClick={() => router.push(`/masjids/${masjid._id}`)}
                style={{ background: 'var(--primary)', color: 'white', borderRadius: '1rem', padding: '1.2rem 1.2rem', display: 'flex', alignItems: 'center', marginBottom: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', cursor: 'pointer' }}
              >
                <div style={{ marginRight: '1rem' }}>
                   <Landmark size={40} color="white" strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>{masjid.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#f0f0f0' }}>{masjid.address}</p>
                </div>
                <div onClick={(e) => { e.stopPropagation(); toggleFavorite(masjid._id); }} style={{ cursor: 'pointer', paddingLeft: '0.5rem' }}>
                  <Star size={24} color="white" fill={favorites[masjid._id] ? "white" : "transparent"} strokeWidth={1.5} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
