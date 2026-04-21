'use client';
import { Clock, MapPin, BookOpen, Compass, Radio, Building2 } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Clock size={40} />,
      title: "Accurate Prayer Times & Reminders",
      description: "Get precise prayer times based on your current location. Set customizable notifications so you never miss a Salah. Our offline mode ensures you have access even without an internet connection."
    },
    {
      icon: <MapPin size={40} />,
      title: "Locate Nearby Masjids",
      description: "Instantly discover mosques around you. Get accurate distances, directions, and view followed mosques like Al Masjid an Nabawi or Masjid al-Haram directly from your dashboard."
    },
    {
      icon: <BookOpen size={40} />,
      title: "Readable Quran & Authentic Hadith",
      description: "Read the Holy Quran with ease. Navigate by Sura, Page, or Juz. Dive into authentic Hadith collections from trustable sources to enrich your Islamic knowledge daily."
    },
    {
      icon: <Compass size={40} />,
      title: "Precision Qibla Direction",
      description: "Find the exact Qibla direction from anywhere in the world using your smartphone's compass. Fast, accurate, and completely free."
    },
    {
      icon: <Building2 size={40} />,
      title: "Business Listings",
      description: "A new feature to help the Ummah connect! Discover Halal businesses, Islamic services, and Madrasas. You can also list your own business straight from the app."
    },
    {
      icon: <Radio size={40} />,
      title: "Mihrab FM & Duas",
      description: "Listen to continuous Islamic broadcasts on Mihrab FM. Access a wide library of Duas, Zikr, and learn the 99 Names of Allah with clear interfaces."
    }
  ];

  return (
    <div className="container" style={{ padding: '6rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '1rem' }}>
          Comprehensive Islamic Features
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--foreground)', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
          Everything you need for your daily spiritual journey, beautifully designed in one unified application.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {features.map((feature, idx) => (
          <div key={idx} className="glass-panel" style={{
            padding: '2.5rem',
            borderRadius: '1rem',
            transition: 'transform 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(65, 194, 220, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
            <p style={{ lineHeight: '1.6', opacity: 0.8 }}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
