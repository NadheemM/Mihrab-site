import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { MapPin, Briefcase } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BusinessDirectory() {
  await connectToDatabase();
  const businesses = await Business.find({ isApproved: true }).sort({ createdAt: -1 });

  return (
    <div className="container" style={{ padding: '6rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Business Directory</h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.8 }}>Discover and support local Islamic businesses and services.</p>
        </div>
        <Link href="/business/submit" className="btn-primary">
          List Your Business
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1rem' }}>
          <Briefcase size={48} style={{ margin: '0 auto 1rem', color: 'var(--border-color)' }} />
          <h3 style={{ marginBottom: '1rem' }}>No Businesses Listed Yet</h3>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Be the first to list your Islamic business on Mihrab App!</p>
          <Link href="/business/submit" className="btn-primary">
            Get Started
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {businesses.map((biz) => (
            <div key={biz._id.toString()} className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 600 }}>{biz.name}</h3>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'var(--primary-light)', color: 'white', borderRadius: '999px', fontWeight: 600 }}>
                  {biz.category}
                </span>
              </div>
              <p style={{ opacity: 0.8, marginBottom: '1.5rem', flexGrow: 1 }}>{biz.description}</p>
              
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '0.5rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>
                  <MapPin size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem' }}>{biz.location}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  Contact: {biz.contactInfo}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
