import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { Calendar, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  await connectToDatabase();
  const post = await Blog.findOne({ slug: resolvedParams.slug });

  if (!post) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '6rem 2rem', maxWidth: '800px' }}>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '2rem', fontWeight: 600 }}>
        <ArrowLeft size={20} /> Back to Blog
      </Link>
      
      <article className="glass-panel" style={{ padding: '4rem 3rem', borderRadius: '1rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem', lineHeight: '1.2' }}>{post.title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', opacity: 0.6, marginBottom: '3rem' }}>
          <Calendar size={18} />
          <span>Published on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--foreground)' }} dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
      </article>
    </div>
  );
}
