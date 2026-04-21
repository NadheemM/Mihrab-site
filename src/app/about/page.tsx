export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', fontSize: '3rem', textAlign: 'center' }}>
          About Mihrab App
        </h1>
        
        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '1rem' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Mihrab App was created with a singular vision: to help Muslims around the world deepen their connection with their faith and their local communities.
          </p>
          
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            In today's fast-paced digital world, maintaining a consistent spiritual routine can be challenging. We built Mihrab to be the ultimate, all-in-one Islamic companion that fits seamlessly into your daily life.
          </p>
          
          <h2 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            To empower Muslims with accessible, accurate, and ad-free Islamic knowledge and tools, fostering a stronger bond between the individual, the Masjid, and the Creator.
          </p>

          <h2 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>What We Offer</h2>
          <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li>Precision prayer times and reminders tailored to your location.</li>
            <li>A comprehensive Mosque locator to find your nearest place of worship.</li>
            <li>The Holy Quran in readable formats with translations.</li>
            <li>Authentic Hadith collections from trusted sources.</li>
            <li>A dedicated platform for discovering verified Islamic businesses and services.</li>
          </ul>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--primary)' }}>
              "Supported by Digital Dawah Center"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
