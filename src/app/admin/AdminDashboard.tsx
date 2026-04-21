'use client';

import { useState } from 'react';

export default function AdminDashboard({ initialBusinesses, initialContacts }: { initialBusinesses: any[], initialContacts: any[] }) {
  const [activeTab, setActiveTab] = useState<'businesses' | 'blogs' | 'contacts'>('businesses');
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [blogData, setBlogData] = useState({ title: '', slug: '', excerpt: '', content: '' });
  const [blogStatus, setBlogStatus] = useState('');

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/business/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true })
      });
      if (res.ok) {
        setBusinesses(businesses.filter(b => b._id !== id));
      } else {
        alert('Failed to approve');
      }
    } catch (e) {
      alert('Error approving');
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogStatus('Submitting...');
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });
      if (res.ok) {
        setBlogStatus('Blog Created Successfully!');
        setBlogData({ title: '', slug: '', excerpt: '', content: '' });
      } else {
        const error = await res.json();
        setBlogStatus('Error: ' + error.error);
      }
    } catch (e) {
      setBlogStatus('Error submitting blog.');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button className={activeTab === 'businesses' ? 'btn-primary' : ''} onClick={() => setActiveTab('businesses')} style={activeTab !== 'businesses' ? { padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '999px', cursor: 'pointer', color: 'var(--foreground)' } : {}}>
          Pending Businesses ({businesses.length})
        </button>
        <button className={activeTab === 'blogs' ? 'btn-primary' : ''} onClick={() => setActiveTab('blogs')} style={activeTab !== 'blogs' ? { padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '999px', cursor: 'pointer', color: 'var(--foreground)' } : {}}>
          Create Blog
        </button>
        <button className={activeTab === 'contacts' ? 'btn-primary' : ''} onClick={() => setActiveTab('contacts')} style={activeTab !== 'contacts' ? { padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '999px', cursor: 'pointer', color: 'var(--foreground)' } : {}}>
          Contact Submissions ({initialContacts.length})
        </button>
      </div>

      {activeTab === 'businesses' && (
        <div>
          {businesses.length === 0 ? <p>No pending approvals.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {businesses.map(b => (
                <div key={b._id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{b.name} <span style={{ fontSize: '0.8rem', background: 'var(--card-bg)', padding: '0.2rem 0.5rem', borderRadius: '0.2rem' }}>{b.category}</span></h3>
                      <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>{b.description}</p>
                      <p style={{ fontSize: '0.9rem' }}><strong>Location:</strong> {b.location} | <strong>Contact:</strong> {b.contactInfo}</p>
                    </div>
                    <button onClick={() => handleApprove(b._id)} className="btn-primary" style={{ backgroundColor: '#10b981' }}>Approve</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'contacts' && (
        <div>
          {initialContacts.length === 0 ? <p>No messages received.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {initialContacts.map(c => (
                <div key={c._id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{c.name} <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>({c.email})</span></h3>
                  <p style={{ opacity: 0.8, fontStyle: 'italic', marginBottom: '0.5rem' }}>"{c.message}"</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>{new Date(c.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'blogs' && (
        <div style={{ maxWidth: '600px' }}>
          <h2>Write a new Blog Post</h2>
          <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>Fill in the details to publish a new article.</p>
          {blogStatus && <p style={{ marginBottom: '1rem', color: blogStatus.includes('Error') ? 'red' : 'green' }}>{blogStatus}</p>}
          <form onSubmit={handleBlogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Title" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--background)' }} />
            <input type="text" placeholder="Slug (e.g. fast-ramadan-tips)" value={blogData.slug} onChange={e => setBlogData({...blogData, slug: e.target.value})} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--background)' }} />
            <input type="text" placeholder="Excerpt" value={blogData.excerpt} onChange={e => setBlogData({...blogData, excerpt: e.target.value})} required style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--background)' }} />
            <textarea placeholder="HTML Content (You can write raw text or html tags like <b>)" value={blogData.content} onChange={e => setBlogData({...blogData, content: e.target.value})} required rows={10} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--background)', resize: 'vertical' }}></textarea>
            <button type="submit" className="btn-primary">Publish Post</button>
          </form>
        </div>
      )}

    </div>
  );
}
