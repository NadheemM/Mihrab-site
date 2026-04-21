'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';

interface Timings {
  fajr: { azaan: string; iqamah: string };
  zuhar: { azaan: string; iqamah: string };
  asar: { azaan: string; iqamah: string };
  maghrib: { azaan: string; iqamah: string };
  isha: { azaan: string; iqamah: string };
  jummah: { azaan: string; iqamah: string };
}

interface Masjid {
  _id: string;
  name: string;
  address: string;
  timings: Timings;
  lastUpdated: string;
}

export default function MasjidDetailsPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Try resolving params to support Next.js 15 breaking changes if needed
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const masjidId = resolvedParams.id;

  const [masjid, setMasjid] = useState<Masjid | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTimings, setEditTimings] = useState<Timings | null>(null);

  const defaultTimings: Timings = {
    fajr: { azaan: '', iqamah: '' },
    zuhar: { azaan: '', iqamah: '' },
    asar: { azaan: '', iqamah: '' },
    maghrib: { azaan: '', iqamah: '' },
    isha: { azaan: '', iqamah: '' },
    jummah: { azaan: '', iqamah: '' },
  };

  useEffect(() => {
    // Adding timestamp to URL to bypass any aggressive client-side caching
    fetch(`/api/masjids/${masjidId}?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setMasjid(data);
        setEditTimings(data.timings || defaultTimings);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching masjid details:", err);
        setLoading(false);
      });
  }, [masjidId]);

  const handleUpdateTimings = async () => {
    if (!editTimings) return;
    try {
      console.log("Sending timings update for:", masjidId);
      const res = await fetch(`/api/masjids/${masjidId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timings: editTimings })
      });
      const data = await res.json();
      if (data.success) {
        setMasjid(data.masjid);
        setIsEditing(false);
      } else {
        console.error("Update failed:", data.error);
        alert("Failed to update timings: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating");
    }
  };

  const calculateTimeAgo = (dateString: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 60) return `${diffMins || 1} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!masjid) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Masjid not found!</div>;

  const prayers = [
    { key: 'fajr', label: 'Fajr' },
    { key: 'zuhar', label: 'Zuhar' },
    { key: 'asar', label: 'Asar' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isha', label: 'Isha' },
    { key: 'jummah', label: 'Jummah' },
  ];

  return (
    <div style={{ backgroundColor: '#FAF8F1', minHeight: '100vh', padding: '2rem 1rem 6rem 1rem', fontFamily: 'inherit' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <div onClick={() => router.back()} style={{ background: 'var(--primary)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '1rem' }}>
            <ArrowLeft size={24} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{masjid.name}</h1>
        </div>

        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem', color: '#111' }}>Salah Timings</h2>

        {/* Timings Card */}
        <div style={{ background: 'var(--primary)', borderRadius: '1.5rem', padding: '2rem 1.5rem', color: 'white', marginBottom: '4rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff', textTransform: 'uppercase', opacity: 0.9 }}>
            <div>NAMAZ</div>
            <div style={{ textAlign: 'center' }}>AZAAN</div>
            <div style={{ textAlign: 'center' }}>IQAMAH</div>
          </div>
          
          {prayers.map((prayer) => (
            <div key={prayer.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '600', alignItems: 'center' }}>
              <div>{prayer.label}</div>
              <div style={{ textAlign: 'center' }}>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={(editTimings as any)?.[prayer.key]?.azaan || ''}
                    onChange={(e) => {
                       if(editTimings) setEditTimings({
                          ...editTimings,
                          [prayer.key]: { ...(editTimings as any)[prayer.key], azaan: e.target.value }
                       })
                    }}
                    style={{ width: '80%', padding: '0.3rem', borderRadius: '0.25rem', border: 'none', color: '#000', textAlign: 'center', fontSize: '1rem' }}
                  />
                ) : (
                  (masjid.timings as any)?.[prayer.key]?.azaan || '-'
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={(editTimings as any)?.[prayer.key]?.iqamah || ''}
                    onChange={(e) => {
                       if(editTimings) setEditTimings({
                          ...editTimings,
                          [prayer.key]: { ...(editTimings as any)[prayer.key], iqamah: e.target.value }
                       })
                    }}
                    style={{ width: '80%', padding: '0.3rem', borderRadius: '0.25rem', border: 'none', color: '#000', textAlign: 'center', fontSize: '1rem' }}
                  />
                ) : (
                  (masjid.timings as any)?.[prayer.key]?.iqamah || '-'
                )}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#fff', opacity: 0.8 }}>
            Updated: {calculateTimeAgo(masjid.lastUpdated)}
          </div>
        </div>

        {/* Action Button */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '1rem', justifyContent: 'center', zIndex: 10 }}>
          {isEditing ? (
            <>
               <button 
                onClick={() => { setIsEditing(false); setEditTimings(masjid.timings || defaultTimings); }}
                style={{ flex: 1, maxWidth: '290px', background: '#eee', color: '#000', padding: '1rem', borderRadius: '0.5rem', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateTimings}
                style={{ flex: 1, maxWidth: '290px', background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              style={{ width: '100%', maxWidth: '600px', background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '0.5rem', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Update Time
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
