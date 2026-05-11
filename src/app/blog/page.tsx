import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { Calendar, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  await connectToDatabase();
  const posts = await Blog.find({}).sort({ createdAt: -1 });

  return (
    <div style={{ backgroundColor: 'var(--surface-cream)', minHeight: '100vh', padding: '5rem 0 6rem' }}>
      <div className="container">

        {/* Header */}
        <ScrollReveal variant="blur">
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="text-gold-label" style={{ marginBottom: '0.5rem' }}>Community News</span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: 'var(--text-headline)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0.75rem 0 1.25rem',
          }}>
            The Blog
          </h1>
          <div className="divider-arabesque" aria-hidden="true">
            <span className="divider-arabesque-icon" />
          </div>
        </header>
        </ScrollReveal>

        {posts.length === 0 ? (
          <div className="glass-panel--warm" style={{
            padding: '3.5rem',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--text-headline)',
              marginBottom: '0.75rem',
            }}>
              No posts yet
            </h3>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
            }}>
              Check back later for new articles and updates.
            </p>
          </div>
        ) : (
          <div className={styles.grid}
          role="list"
          aria-label="Blog posts"
          >
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} variant="scale" delay={i * 150} style={{ display: 'flex', height: '100%' }}>
              <Link
                href={`/blog/${post.slug}`}
                role="listitem"
                className={styles.card}
              >
                {/* Image area / geometric gradient header */}
                <div style={{
                  height: '180px',
                  background: `linear-gradient(135deg, var(--surface-dark) 0%, rgba(65,194,220,0.2) 100%)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: [
                      'repeating-linear-gradient(45deg, rgba(201,146,42,0.07) 0px, rgba(201,146,42,0.07) 1px, transparent 1px, transparent 18px)',
                      'repeating-linear-gradient(-45deg, rgba(201,146,42,0.07) 0px, rgba(201,146,42,0.07) 1px, transparent 1px, transparent 18px)',
                    ].join(','),
                  }} aria-hidden="true" />
                  <span style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1.25rem',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--brand-gold)',
                    background: 'rgba(201,146,42,0.12)',
                    border: '1px solid rgba(201,146,42,0.25)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.25rem 0.625rem',
                  }}>
                    Article
                  </span>
                </div>

                {/* Card body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--text-headline)',
                    lineHeight: 1.3,
                    marginBottom: '0.75rem',
                  }}>
                    {post.title}
                  </h2>

                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.65,
                    flexGrow: 1,
                    marginBottom: '1.25rem',
                  }}>
                    {post.excerpt}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}>
                      <Calendar size={13} aria-hidden="true" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: 'var(--brand-teal-dark)',
                    }}>
                      Read <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
