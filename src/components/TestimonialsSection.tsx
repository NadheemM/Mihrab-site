'use client';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';

const testimonials = [
  {
    name: 'Abdullah R.',
    city: 'Community Member',
    rating: 5,
    quote: 'Mihrab has completely changed how I manage my daily prayers. The accurate azaan times and masjid locator are exactly what I needed. Truly a blessing for our community.',
  },
  {
    name: 'Fatima N.',
    city: 'Regular User',
    rating: 5,
    quote: 'The Quran reading experience is beautiful and the Duas section is comprehensive. I use Mihrab every single day — it is the best Islamic app I have ever used.',
  },
  {
    name: 'Ibrahim K.',
    city: 'App User',
    rating: 5,
    quote: 'Mihrab FM keeps me connected to Islamic content throughout the day. The 99 Names of Allah feature is a beautiful addition. May Allah reward the developers.',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? '#41C2DC' : '#D4EEEE'}
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      style={{ padding: '5rem 0', background: '#FFFFFF' }}
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        <ScrollReveal variant="fade">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="text-gold-label">Community Love</span>
            <h2
              id="testimonials-heading"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.875rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                color: '#0F1A30',
                margin: '0.5rem 0 0',
                letterSpacing: '-0.02em',
              }}
            >
              Loved by the community
            </h2>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 150} variant="up">
              <TiltCard
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(65,194,220,0.15)',
                  borderRadius: 16,
                  padding: '1.75rem',
                  boxShadow: '0 4px 20px rgba(65,194,220,0.07)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <Stars count={t.rating} />

                <blockquote style={{ margin: 0 }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: '#2D3748',
                    margin: 0,
                    fontStyle: 'italic',
                  }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>

                <footer style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #41C2DC 0%, #2B9AB5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: '#0F1A30',
                    flexShrink: 0,
                  }} aria-hidden="true">
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: '#0F1A30', margin: 0 }}>
                      {t.name}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#718096', margin: 0 }}>
                      {t.city}
                    </p>
                  </div>
                </footer>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
