import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  await connectToDatabase();
  const posts = await Blog.find({}).sort({ createdAt: -1 });

  return (
    <div className="container" style={{ padding: '6rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '1rem' }}>
          Islamic Articles & Updates
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--foreground)', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
          Explore our latest insights, app updates, and inspirational content.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1rem' }}>
          <h3>No posts yet</h3>
          <p style={{ opacity: 0.8 }}>Check back later for new articles.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', textDecoration: 'none' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{post.title}</h2>
              <p style={{ color: 'var(--foreground)', opacity: 0.8, marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.6' }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', opacity: 0.6, fontSize: '0.9rem' }}>
                <Calendar size={16} />
                {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
