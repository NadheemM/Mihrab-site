import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { MapPin, Briefcase, Phone } from 'lucide-react';

type BizEntry = {
  _id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  contactInfo: string;
};

const STATIC_BUSINESSES: BizEntry[] = [
  {
    _id: 'static-ayisha-1',
    name: 'Ayishama Aatupannai',
    category: 'Services',
    description: 'To create an opportunity to make everyone give qurbani. Quality goats for Eid al-Adha sacrifice, delivered with care across Tamil Nadu.',
    location: 'Tamil Nadu',
    contactInfo: 'Contact via Mihrab App',
  },
  {
    _id: 'static-ayisha-2',
    name: 'Ayishama Aatupannai',
    category: 'Services',
    description: 'To create an opportunity to make everyone give qurbani. Quality goats for Eid al-Adha sacrifice, delivered with care across Tamil Nadu.',
    location: 'Tamil Nadu',
    contactInfo: 'Contact via Mihrab App',
  },
  {
    _id: 'static-ayisha-3',
    name: 'Ayishama Aatupannai',
    category: 'Services',
    description: 'To create an opportunity to make everyone give qurbani. Quality goats for Eid al-Adha sacrifice, delivered with care across Tamil Nadu.',
    location: 'Tamil Nadu',
    contactInfo: 'Contact via Mihrab App',
  },
];

export const dynamic = 'force-dynamic';

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Food:     { bg: 'rgba(201,146,42,0.1)',  text: 'var(--brand-gold)',   border: 'rgba(201,146,42,0.25)' },
  Services: { bg: 'rgba(65,194,220,0.1)',  text: 'var(--brand-teal-dark)', border: 'rgba(65,194,220,0.25)' },
  Retail:   { bg: 'rgba(107,140,174,0.1)', text: 'var(--fajr-color)',  border: 'rgba(107,140,174,0.25)' },
  Madrasa:  { bg: 'rgba(74,72,128,0.1)',   text: 'var(--isha-color)',  border: 'rgba(74,72,128,0.25)' },
};

function categoryStyle(category: string) {
  return categoryColors[category] ?? { bg: 'rgba(122,110,96,0.1)', text: 'var(--text-muted)', border: 'rgba(122,110,96,0.25)' };
}

export default async function BusinessDirectory() {
  await connectToDatabase();
  const dbBusinesses = await Business.find({ isApproved: true }).sort({ createdAt: -1 });
  const businesses: BizEntry[] = [
    ...STATIC_BUSINESSES,
    ...dbBusinesses.map(b => ({
      _id: b._id.toString(),
      name: b.name,
      category: b.category,
      description: b.description,
      location: b.location,
      contactInfo: b.contactInfo,
    })),
  ];

  return (
    <div style={{ backgroundColor: 'var(--surface-muted)', minHeight: '100vh', padding: '5rem 0 6rem' }}>
      <div className="container">

        {/* Header */}
        <ScrollReveal variant="blur">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <span className="text-gold-label" style={{ marginBottom: '0.5rem' }}>Muslim-Owned Businesses</span>
            <h1 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: 'var(--text-headline)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: '0.5rem 0 0.5rem',
            }}>
              Business Directory
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
              margin: 0,
            }}>
              Discover and support local Islamic businesses and services.
            </p>
          </div>
          <Link href="/business/submit" className="btn btn-primary">
            List Your Business
          </Link>
        </div>
        </ScrollReveal>

        {businesses.length === 0 ? (
          <div className="glass-panel--warm" style={{
            padding: '3.5rem',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.25rem',
              background: 'rgba(122,110,96,0.1)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}>
              <Briefcase size={28} aria-hidden="true" />
            </div>
            <h3 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--text-headline)',
              marginBottom: '0.75rem',
            }}>
              No Businesses Listed Yet
            </h3>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
              marginBottom: '2rem',
            }}>
              Be the first to list your Islamic business on Mihrab App!
            </p>
            <Link href="/business/submit" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        ) : (
          <div role="list" aria-label="Business listings" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {businesses.map((biz, i) => {
              const catStyle = categoryStyle(biz.category);
              return (
                <ScrollReveal key={biz._id.toString()} variant="up" delay={i * 150}>
                <div
                  role="listitem"
                  className="business-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.5rem',
                    background: 'var(--surface-warm-white)',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-warm)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {/* Octagon initial avatar */}
                  <div
                    aria-hidden="true"
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, var(--brand-teal-light), rgba(65,194,220,0.25))',
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: 'var(--brand-teal-dark)',
                      lineHeight: 1,
                    }}>
                      {biz.name.charAt(0)}
                    </span>
                  </div>

                  {/* Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <h3 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'var(--text-headline)',
                        margin: 0,
                      }}>
                        {biz.name}
                        <span className="sr-only"> (listing {i + 1})</span>
                      </h3>
                      <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.625rem',
                        borderRadius: 'var(--radius-pill)',
                        background: catStyle.bg,
                        color: catStyle.text,
                        border: `1px solid ${catStyle.border}`,
                      }}>
                        {biz.category}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      margin: '0 0 0.6rem',
                      lineHeight: 1.55,
                    }}>
                      {biz.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)',
                      }}>
                        <MapPin size={13} aria-hidden="true" /> {biz.location}
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)',
                      }}>
                        <Phone size={13} aria-hidden="true" /> {biz.contactInfo}
                      </span>
                    </div>
                  </div>

                  {/* Placeholder action */}
                  <div style={{ flexShrink: 0 }} />
                </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
