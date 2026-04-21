'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GalleryPage() {
  const images = [
    '/1.jpeg',
    '/2.jpeg',
    '/3.jpeg',
    '/4.jpeg',
    '/5.jpeg',
    '/6.jpeg',
    '/7.jpeg',
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="container" style={{ padding: '6rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '1rem' }}>
          App Gallery
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--foreground)', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
          A sneak peek into the beautiful, intuitive interfaces of the Mihrab App.
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '5rem'
      }}>
        <div style={{
          width: '280px',
          height: '560px',
          borderRadius: '2rem',
          background: 'var(--card-bg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '8px solid #222',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {images.map((src, index) => (
            <div
              key={src}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentIndex ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <Image 
                src={src} 
                alt={`Screenshot ${index + 1}`} 
                fill
                sizes="280px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div style={{ textAlign: 'center', marginBottom: '5rem', padding: '0 1rem' }}>
        <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '2rem' }}>
          See it in Action
        </h2>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          aspectRatio: '16/9', 
          borderRadius: '1rem', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)' 
        }}>
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/3wkIk6Q4Hl0" 
            title="Mihrab App Preview" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            style={{ display: 'block' }}
          ></iframe>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Experience it yourself. Download the app today.
        </p>
        <a href="https://play.google.com/store/apps/details?id=in.mihrab.app&hl=en_IN" target="_blank" rel="noreferrer" className="btn-primary">
          Download from PlayStore
        </a>
      </div>
    </div>
  );
}
